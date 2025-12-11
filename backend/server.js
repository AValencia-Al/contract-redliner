import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import docxConverter from "docx-pdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

if (!process.env.MONGODB_URI) {
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => {
    process.exit(1);
  });

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    aiModel: { type: String, default: "gemini-2.5-flash" },
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
    previewPdfUrl: String,
    aiSuggestions: [
      {
        id: String,
        sectionTitle: String,
        original: String,
        suggestion: String,
        reason: String,
      },
    ],
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

if (!process.env.GEMINI_API_KEY) {
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractTextFromPdf(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item) =>
      "str" in item ? item.str : ""
    );
    text += strings.join(" ") + "\n";
  }

  return text;
}

async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === ".pdf" || mime === "application/pdf") {
    return await extractTextFromPdf(file.buffer);
  }

  if (
    ext === ".docx" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || "";
  }

  if (ext === ".txt" || mime === "text/plain") {
    return file.buffer.toString("utf8");
  }

  throw new Error("Unsupported file type. Use PDF, DOCX, or TXT.");
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!email || !emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

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

app.post("/api/auth/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password" });
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

app.get("/api/contracts/:id/download-pdf", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const doc = new PDFDocument({
      margin: 72,
      size: 'A4',
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(contract.title || "contract")
        .replace(/\s+/g, "_")
        .toLowerCase()}_revised.pdf"`
    );

    doc.pipe(res);

    // Title
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(contract.title || "Contract (Revised)", {
        align: "center",
        underline: true
      })
      .moveDown(1.5);

    // Content - split by paragraphs and preserve structure
    const paragraphs = contract.content.split(/\n\n+/);

    doc.font('Helvetica').fontSize(11);

    paragraphs.forEach((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return;

      // Check if it's a heading (all caps or ends with colon)
      const isHeading = trimmed === trimmed.toUpperCase() ||
                       (trimmed.length < 100 && trimmed.endsWith(':'));

      if (isHeading) {
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(trimmed, {
            align: 'left',
            continued: false
          })
          .moveDown(0.5);
        doc.font('Helvetica').fontSize(11);
      } else {
        // Regular paragraph with proper line spacing
        const lines = trimmed.split('\n');
        lines.forEach((line, lineIndex) => {
          if (line.trim()) {
            doc.text(line.trim(), {
              align: 'justify',
              indent: 0,
              lineGap: 2
            });
          }
        });

        if (index < paragraphs.length - 1) {
          doc.moveDown(0.8);
        }
      }
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

app.get("/api/contracts/:id/download-docx", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Parse content into paragraphs
    const paragraphs = contract.content.split(/\n\n+/);
    const docParagraphs = [];

    // Add title
    docParagraphs.push(
      new Paragraph({
        text: contract.title || "Contract (Revised)",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Add content paragraphs
    paragraphs.forEach((para) => {
      const trimmed = para.trim();
      if (!trimmed) return;

      // Check if it's a heading (all caps or ends with colon)
      const isHeading = trimmed === trimmed.toUpperCase() ||
                       (trimmed.length < 100 && trimmed.endsWith(':'));

      if (isHeading) {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmed,
                bold: true,
                size: 24
              })
            ],
            spacing: { before: 240, after: 120 }
          })
        );
      } else {
        // Handle multi-line paragraphs
        const lines = trimmed.split('\n');
        lines.forEach((line, lineIndex) => {
          if (line.trim()) {
            docParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.trim(),
                    size: 22
                  })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                  after: lineIndex === lines.length - 1 ? 200 : 80,
                  line: 276
                }
              })
            );
          }
        });
      }
    });

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: docParagraphs
      }]
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(contract.title || "contract")
        .replace(/\s+/g, "_")
        .toLowerCase()}_revised.docx"`
    );

    res.send(buffer);
  } catch (err) {
    console.error("DOCX generation failed:", err);
    res.status(500).json({ message: "Failed to generate DOCX" });
  }
});

app.post(
  "/api/contracts/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      const { title } = req.body;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const content = await extractTextFromFile(file);

      const safeName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, file.buffer);

      const ext = path.extname(file.originalname).toLowerCase();
      const mime = file.mimetype;
      let previewPdfUrl = null;

      // Convert DOCX to PDF for preview
      const isDocx =
        ext === ".docx" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (isDocx) {
        try {
          const pdfFileName = safeName.replace(/\.docx$/i, "") + "-preview.pdf";
          const pdfPath = path.join(uploadsDir, pdfFileName);

          await new Promise((resolve, reject) => {
            docxConverter(filePath, pdfPath, (err, result) => {
              if (err) {
                console.error("DOCX to PDF conversion failed:", err);
                reject(err);
              } else {
                resolve(result);
              }
            });
          });

          previewPdfUrl = `/uploads/${pdfFileName}`;
        } catch (conversionError) {
          console.error(
            "Failed to generate preview PDF, continuing without it:",
            conversionError
          );
        }
      }

      const contract = await Contract.create({
        owner: req.userId,
        title: title?.trim() || file.originalname,
        content,
        originalFile: {
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${safeName}`,
        },
        previewPdfUrl,
      });

      res.status(201).json(contract);
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ message: "Failed to upload contract" });
    }
  }
);

app.post("/api/contracts/:id/analyze", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const user = await User.findById(req.userId).select("aiModel");
    let modelName = user?.aiModel || "gemini-2.5-flash";
    if (!modelName.startsWith("gemini-")) {
      modelName = "gemini-2.5-flash";
    }

    const prompt = `
You are a helpful legal assistant. Read the following contract and provide concise, practical insights
in bullet points. Focus on key obligations, risks, unusual clauses, and anything the user should pay attention to.

Contract title: ${contract.title || "(Untitled)"}

Contract text:
${contract.content}
`;

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysis =
      (response.text && response.text()) || "No analysis generated.";

    contract.aiInsights = analysis;
    await contract.save();

    res.json({ analysis });
  } catch (err) {
    console.error("Analyze failed:", err);
    res
      .status(500)
      .json({ message: err?.message || "Failed to analyze contract" });
  }
});

app.post("/api/contracts/:id/suggest-changes", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const user = await User.findById(req.userId).select("aiModel");
    let modelName = user?.aiModel || "gemini-2.5-flash";
    if (!modelName.startsWith("gemini-")) {
      modelName = "gemini-2.5-flash";
    }

    const prompt = `
You are a legal assistant. Read the following contract text and propose up to 5 specific improvements.
Focus on clarity, risk reduction, and fairness.

Return ONLY valid JSON in this exact format:

[
  {
    "id": "sug-1",
    "sectionTitle": "Optional short title",
    "original": "original clause text here",
    "suggestion": "improved clause text here",
    "reason": "short explanation of why this change is helpful"
  }
]

Contract text:
${contract.content}
`;

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = (response.text && response.text()) || "[]";

    let raw = text.trim();
    if (raw.startsWith("```")) {
      const firstNewline = raw.indexOf("\n");
      if (firstNewline !== -1) {
        raw = raw.slice(firstNewline + 1);
      }
      const lastFence = raw.lastIndexOf("```");
      if (lastFence !== -1) {
        raw = raw.slice(0, lastFence);
      }
    }

    let suggestions = [];
    try {
      suggestions = JSON.parse(raw);
      if (!Array.isArray(suggestions)) {
        suggestions = [];
      }
    } catch (e) {
      console.error("Failed to parse suggestions JSON:", raw);
      return res
        .status(500)
        .json({ message: "AI returned invalid suggestions JSON" });
    }

    contract.aiSuggestions = suggestions;
    await contract.save();

    res.json({ suggestions });
  } catch (err) {
    console.error("Suggest changes failed:", err);
    res
      .status(500)
      .json({ message: err?.message || "Failed to generate suggestions" });
  }
});

app.post("/api/contracts/:id/apply-suggestion", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { suggestionId } = req.body;

    const contract = await Contract.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const suggestion = (contract.aiSuggestions || []).find(
      (s) => s.id === suggestionId
    );

    if (!suggestion) {
      return res.status(400).json({ message: "Suggestion not found" });
    }

    const original = suggestion.original || "";
    const replacement = suggestion.suggestion || "";

    if (!original || !replacement) {
      return res.status(400).json({ message: "Invalid suggestion" });
    }

    const updatedContent = contract.content.replace(original, replacement);
    contract.content = updatedContent;
    contract.aiSuggestions = (contract.aiSuggestions || []).filter(
      (s) => s.id !== suggestionId
    );

    await contract.save();

    res.json({ contract });
  } catch (err) {
    console.error("Apply suggestion failed:", err);
    res
      .status(500)
      .json({ message: err?.message || "Failed to apply suggestion" });
  }
});

const distPath = path.join(rootDir, "dist");
app.use(express.static(distPath));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
