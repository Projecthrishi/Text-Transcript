import React from "react";
import Upload from "./Upload";
import "./App.css";

import Recorder from "./Recorder";
import Transcription from "./Transcription";

const App = () => {
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Speech-to-Text Transcription</h1>
      <Upload />
      <Recorder />
      <Transcription />
    </div>
  );
};

export default App;
