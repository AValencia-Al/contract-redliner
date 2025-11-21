import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    aiModel: { type: String, default: "gpt-4.1-mini" },
  },
  { timestamps: true }
);

const contractSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    content: String,
    status: { type: String, default: "draft" },
    aiSummary: String,
    aiInsights: String,
    originalFile: {
      fileName: String,
      mimeType: String,
      size: Number,
      url: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Contract = mongoose.model("Contract", contractSchema);

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Register failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

app.get("/api/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email aiModel");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to load settings" });
  }
});

app.put("/api/settings", auth, async (req, res) => {
  try {
    const { name, aiModel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, aiModel },
      { new: true }
    ).select("name email aiModel");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to save settings" });
  }
});

app.get("/api/contracts", auth, async (req, res) => {
  try {
    const contracts = await Contract.find({ owner: req.userId }).sort({
      createdAt: -1,
    });
    res.json(contracts);
  } catch {
    res.status(500).json({ message: "Failed to load contracts" });
  }
});

app.post("/api/contracts", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const contract = await Contract.create({
      owner: req.userId,
      title,
      content,
    });
    res.status(201).json(contract);
  } catch {
    res.status(500).json({ message: "Failed to create contract" });
  }
});

app.delete("/api/contracts/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Contract.deleteOne({ _id: id, owner: req.userId });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Failed to delete contract" });
  }
});

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
