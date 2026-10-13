import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";

export default function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome/Edge or upload voice notes in Notes tab.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        toast.loading("Listening... Speak your question now", { id: "rec" });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript?.(transcript);
          toast.success("Voice captured!", { id: "rec" });
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        toast.dismiss("rec");
      };

      recognition.onend = () => {
        setIsRecording(false);
        toast.dismiss("rec");
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      toast.error("Microphone access failed.");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`h-11 w-11 rounded-xl border flex items-center justify-center transition ${
        isRecording
          ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse"
          : "border-border bg-card text-muted hover:text-white hover:bg-card/80"
      }`}
      title={isRecording ? "Stop voice listening" : "Ask with voice"}
    >
      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}