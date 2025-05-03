import React from "react";

const Transcription = ({ transcription }) => {
  if (!transcription) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    alert("Transcription copied to clipboard!");
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Transcription:</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{transcription}</p>
      <button
        onClick={handleCopy}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Copy Text
      </button>
    </div>
  );
};

export default Transcription;
