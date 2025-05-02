const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch"); // Ensure fetch is available
const { createClient } = require("@supabase/supabase-js");

// ✅ Load environment variables (Update if using .env)
const SUPABASE_URL = "https://nqgmpsllzsarhcwbsydx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZ21wc2xsenNhcmhjd2JzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0OTY0MzAsImV4cCI6MjA1NjA3MjQzMH0.1VI8Y-kGtkf194UT9xN_KUejPqjDarvqN1a0hZ0EyfE";
const ASSEMBLYAI_API_KEY = "b811ec03b4184998b676b0a079d12230"; // ✅ AssemblyAI Key

// ✅ Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("✅ Received File:", req.file.originalname);

    const fileName = `audio_${Date.now()}.mp3`;

    // ✅ Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("audio-uploads")
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      console.error("❌ Upload Error:", error);
      return res.status(500).json({ error: error.message });
    }

    // ✅ Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("audio-uploads")
      .getPublicUrl(fileName);

    console.log("✅ Uploaded File URL:", publicUrlData.publicUrl);

    res.json({ fileUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Transcription Route with AssemblyAI Polling
app.post("/transcribe", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ error: "No file URL provided" });

    console.log("✅ Sending file to AssemblyAI:", fileUrl);

    const TRANSCRIPTION_API_URL = "https://api.assemblyai.com/v2/transcript";

    // Step 1: Send File to AssemblyAI
    const response = await fetch(TRANSCRIPTION_API_URL, {
      method: "POST",
      headers: {
        "Authorization": ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_url: fileUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ AssemblyAI API Error:", errorText);
      return res.status(500).json({ error: "AssemblyAI failed", details: errorText });
    }

    const data = await response.json();
    console.log("✅ Transcription ID:", data.id);

    // Step 2: Poll for Transcription Result
    let transcriptionResult;
    while (!transcriptionResult) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again

      const checkResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${data.id}`, {
        headers: { "Authorization": ASSEMBLYAI_API_KEY },
      });

      const checkData = await checkResponse.json();

      if (checkData.status === "completed") {
        transcriptionResult = checkData.text;
        console.log("✅ Transcription Completed:", transcriptionResult);
        return res.json({ transcription: transcriptionResult });
      } else if (checkData.status === "failed") {
        console.error("❌ Transcription Failed");
        return res.status(500).json({ error: "Transcription failed" });
      }
    }
  } catch (error) {
    console.error("❌ Transcription Error:", error.message);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
