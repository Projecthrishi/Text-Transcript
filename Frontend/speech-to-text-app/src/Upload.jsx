import { useState } from "react";
import React from "react";
import "./App.css";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const [transcription, setTranscription] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    // 🔴 Handle File Selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 🎤 Start Recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/mp3" });
                setAudioBlob(audioBlob);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    // ⏹ Stop Recording
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    // 📤 Upload File (Recorded or Selected)
    const handleUpload = async () => {
        if (!file && !audioBlob) {
            alert("Please select or record a file first!");
            return;
        }

        const formData = new FormData();
        if (audioBlob) {
            formData.append("file", audioBlob, "recorded_audio.mp3");
        } else if (file) {
            formData.append("file", file);
        }

        console.log("📤 Uploading file...");
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.fileUrl) {
            console.log("✅ File uploaded successfully:", data.fileUrl);
            setFileUrl(data.fileUrl);
            alert("File uploaded successfully!");
        } else {
            console.error("❌ Upload Error:", data);
            alert("File upload failed!");
        }
    };

    // 🎙️ Transcription Request
    const handleTranscription = async () => {
        if (!fileUrl) {
            alert("No file uploaded yet!");
            return;
        }

        console.log("📤 Sending file URL to backend for transcription:", fileUrl);
        const response = await fetch("http://localhost:5000/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl }),
        });

        const data = await response.json();
        console.log("📝 Received transcription:", data);

        if (data.transcription) {
            setTranscription(data.transcription);
        } else {
            setTranscription("No transcription available.");
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-box">
                <h2>Upload or Record Audio</h2>
                
                {/* File Upload Input */}
                <input type="file" accept="audio/*" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>

                {/* Audio Recorder Controls */}
                <div className="record-controls">
                    {!isRecording ? (
                        <button className="record-btn" onClick={startRecording}>Start Recording</button>
                    ) : (
                        <button className="stop-btn" onClick={stopRecording}>Stop Recording</button>
                    )}
                </div>

                {/* Audio Preview */}
                {fileUrl && (
                    <>
                        <audio controls>
                            <source src={fileUrl} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                        <button onClick={handleTranscription}>Get Transcription</button>
                    </>
                )}

                {/* Transcription Display */}
                {transcription && (
                    <div className="transcription-box">
                        <h3>Transcription:</h3>
                        <p className="transcription-text">{transcription}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
