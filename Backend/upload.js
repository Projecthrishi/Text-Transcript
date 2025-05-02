const express = require("express");
const multer = require("multer");
const { supabase } = require("./config");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// ✅ File Upload Route
router.post("/", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        console.log("🚀 Sending audio to transcription API:", fileUrl);

        // ✅ Validate File Type (MP3/WAV)
        const allowedTypes = ["audio/mpeg", "audio/wav"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid file format. Use MP3 or WAV." });
        }

        const fileName = `audio_${Date.now()}.mp3`;

        // ✅ Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("audio-uploads")
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

        if (error) return res.status(500).json({ error: error.message });

        // ✅ Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from("audio-uploads")
            .getPublicUrl(fileName);

        res.json({ fileUrl: publicUrlData.publicUrl });
    } catch (err) {
        console.error("❌ Upload Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
