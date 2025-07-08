import React from "react";

type VoiceRecorderProps = {
  onTranscription: (text: string) => void;
};

export default function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  // This is a placeholder. Replace with real voice recording logic later.
  const handleClick = () => {
    onTranscription("This is a dummy transcript from the VoiceRecorder.");
  };

  return (
    <button
      onClick={handleClick}
      style={{ padding: "1rem 2rem", fontSize: "1rem", borderRadius: 8, background: "#0070f3", color: "white", border: "none", cursor: "pointer" }}
    >
      🎙️ Start Recording (Simulated)
    </button>
  );
} 