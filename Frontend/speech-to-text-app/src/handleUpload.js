const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Uploaded File URL:", data.url); // ✅ URL from Supabase

        // Display the audio in an <audio> tag
        const audioElement = document.createElement("audio");
        audioElement.src = data.url;
        audioElement.controls = true;
        document.body.appendChild(audioElement); // Append to page
    } catch (error) {
        console.error("Upload failed:", error);
    }
};

