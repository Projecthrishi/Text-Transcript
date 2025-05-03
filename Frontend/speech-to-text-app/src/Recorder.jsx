import React, { useState, useRef } from "react";

const Recorder = ({ onRecordingComplete = () => {} }) => { 
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                onRecordingComplete(audioBlob); // ✅ Safe function call
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("❌ Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            console.error("❌ Cannot stop recording: mediaRecorder is not initialized");
        }
    };

    return (
        <div className="recorder-container">
            
           

            {audioUrl && (
                <audio controls>
                    <source src={audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default Recorder;
