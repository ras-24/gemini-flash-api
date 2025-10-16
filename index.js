import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({
  dest: "uploads/",
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// **Set your default Gemini model here:**
const GEMINI_MODEL = "gemini-2.5-flash";

function extractText(resp) {
  try {
    const text =
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
      resp?.response?.candidates?.[0]?.content?.text;

    return text ?? JSON.stringify(resp, null, 2);
  } catch (err) {
    console.error("Error extracting text:", err);
    return JSON.stringify(resp, null, 2);
  }
}

app.use(cors());
app.use(express.json());

// 1. Generate Text
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;
    const resp = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.json({ result: extractText(resp) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Generate from Image
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!filePath) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const { prompt } = req.body;
    const image = await ai.files.upload({
      file: filePath,
      config: {
        mimeType: req.file.mimetype,
      },
    });

    const resp = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt || "What's in this picture?" },
        {
          fileData: { mimeType: image.mimeType, fileUri: image.uri },
        },
      ],
    });
    res.json({ result: extractText(resp) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath) await fs.unlink(filePath);
  }
});

// 3. Generate from Document
app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {
    const filePath = req.file?.path;
    try {
      if (!filePath) {
        return res.status(400).json({ error: "No file uploaded." });
      }
      const { prompt } = req.body;
      const documentFile = await ai.files.upload({
        file: filePath,
        config: { mimeType: req.file.mimetype },
      });
      const resp = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          { text: prompt || "Summarize this document:" },
          {
            fileData: {
              mimeType: documentFile.mimeType,
              fileUri: documentFile.uri,
            },
          },
        ],
      });
      res.json({ result: extractText(resp) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (filePath) await fs.unlink(filePath);
    }
  }
);

// 4. Generate from Audio
app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!filePath) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const { prompt } = req.body;
    let mimeType = req.file.mimetype;
    if (
      path.extname(req.file.originalname).toLowerCase() === ".mp3" &&
      mimeType !== "audio/mpeg"
    ) {
      console.warn(
        `Multer reported MIME type as ${mimeType} for .mp3. Overriding to audio/mpeg.`
      );
      mimeType = "audio/mpeg";
    }

    const audioFile = await ai.files.upload({
      file: filePath,
      config: { mimeType: mimeType },
    });
    const resp = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt || "Transcribe this audio:" },
        { fileData: { mimeType: audioFile.mimeType, fileUri: audioFile.uri } },
      ],
    });
    res.json({ result: extractText(resp) });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error in /generate-from-audio:", err);
  } finally {
    if (filePath) {
      await fs
        .unlink(filePath)
        .catch((unlinkErr) =>
          console.error(
            `Error cleaning up temporary file ${filePath}:`,
            unlinkErr
          )
        );
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));
