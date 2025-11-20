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

// ============== MIDDLEWARE ==============
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ============== UPLOADS FOLDER ==============
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ============== MULTER (FILE UPLOADS) ==============
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ============== MONGODB ==============
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ============== SCHEMAS & MODELS ==============
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
    content: String, // extracted text (PDF/DOCX/TXT)
    status: { type: String, default: "draft" },
    aiSummary: String,
    aiInsights: String,
    originalFile: {
      fileName: String,
      mimeType: String,
      size: Number,
      url: String, // e.g. /uploads/12345-myfile.pdf
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Contract = mongoose.model("Contract", contractSchema);

// ============== AUTH MIDDLEWARE ==============
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ============== OPENAI CLIENT ==============
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. /analyze route will fail.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============== HEALTH CHECK ==============
app.get("/", (_req, res) => {
  res.send("Backend is running ✅");
});

// ============== AUTH ROUTES ==============
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
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
    console.error("Register error:", err);
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
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

// ============== SETTINGS ROUTES ==============
app.get("/api/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email aiModel");
    res.json(user);
  } catch (err) {
    console.error("Get settings error:", err);
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
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

// ============== CONTRACT CRUD ROUTES ==============
app.get("/api/contracts", auth, async (req, res) => {
  try {
    const contracts = await Contract.find({ owner: req.userId }).sort({
      createdAt: -1,
    });
    res.json(contracts);
  } catch (err) {
    console.error("Get contracts error:", err);
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
  } catch (err) {
    console.error("Create contract error:", err);
    res.status(500).json({ message: "Failed to create contract" });
  }
});

app.delete("/api/contracts/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Contract.deleteOne({ _id: id, owner: req.userId });
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete contract error:", err);
    res.status(500).json({ message: "Failed to delete contract" });
  }
});

// ============== FILE UPLOAD ROUTE (PDF / DOCX / TXT) ==============
app.post(
  "/api/contracts/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("UPLOAD FILE:", {
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      let text = "";

      const lowerName = file.originalname.toLowerCase();
      const mime = file.mimetype;

      const isPdf =
        mime === "application/pdf" ||
        mime === "application/x-pdf" ||
        lowerName.endsWith(".pdf");

      const isDocx =
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        lowerName.endsWith(".docx");

      if (isPdf) {
        try {
          // ✅ IMPORTANT: convert Buffer -> Uint8Array for pdfjs
          const uint8Array = new Uint8Array(file.buffer);
          const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str).join(" ");
            fullText += strings + "\n";
          }

          text = fullText;
        } catch (parseErr) {
          console.error("PDF parse error:", parseErr);
          text = "";
        }
      } else if (isDocx) {
        try {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          text = result.value || "";
        } catch (parseErr) {
          console.error("DOCX parse error:", parseErr);
          text = "";
        }
      } else if (mime.startsWith("text/")) {
        text = file.buffer.toString("utf8");
      } else {
        return res.status(400).json({
          message: "Unsupported file type (only PDF, DOCX, TXT)",
        });
      }

      const titleFromBody = req.body.title?.trim();
      const titleFromName = file.originalname.replace(/\.[^/.]+$/, "");
      const title = titleFromBody || titleFromName || "Untitled contract";

      const safeName = file.originalname.replace(/\s+/g, "_");
      const fileNameOnDisk = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadsDir, fileNameOnDisk);
      fs.writeFileSync(filePath, file.buffer);

      const contract = await Contract.create({
        owner: req.userId,
        title,
        content: text,
        originalFile: {
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${fileNameOnDisk}`,
        },
      });

      res.status(201).json(contract);
    } catch (err) {
      console.error("Upload contract error:", err);
      res.status(500).json({ message: "Failed to upload contract" });
    }
  }
);

// ============== AI ANALYSIS ROUTE ==============
app.post("/api/contracts/:id/analyze", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findOne({ _id: id, owner: req.userId });
    if (!contract) return res.status(404).json({ message: "Not found" });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI key not configured" });
    }

    const user = await User.findById(req.userId);
    const model = user?.aiModel || "gpt-4.1-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an AI legal assistant. Summarise the contract and highlight key clauses and potential risks in bullet points.",
        },
        { role: "user", content: contract.content },
      ],
    });

    const analysis = completion.choices[0].message.content;

    contract.aiInsights = analysis;
    await contract.save();

    res.json({ analysis });
  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ message: "AI analysis failed" });
  }
});

// ============== START SERVER ==============
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
