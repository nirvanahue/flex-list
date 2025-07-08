import React, { useRef, useState } from "react";

type VoiceRecorderProps = {
  onTranscription: (text: string) => void;
};

export default function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(audioBlob));
      await sendToTranscribe(audioBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendToTranscribe = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onTranscription(data.text || "No transcript found.");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
          borderRadius: 8,
          background: recording ? "#e00" : "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {recording ? "⏹️ Stop Recording" : "🎙️ Start Recording"}
      </button>
      {audioURL && (
        <div style={{ marginTop: 16 }}>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
} 