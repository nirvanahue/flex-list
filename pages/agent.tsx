import { useState } from "react";
import VoiceRecorder from "../components/VoiceRecorder";

export default function AgentPage() {
  const [transcript, setTranscript] = useState("");
  const [agent, setAgent] = useState("");
  const [result, setResult] = useState<string[] | string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranscription = async (transcript: string, mcpResponse: any) => {
    setTranscript(transcript);
    setLoading(true);

    try {
      // Extract agent from MCP response
      const msg = mcpResponse?.choices?.[0]?.message?.content;
      let agentName = "suggest";
      if (msg) {
        try {
          const parsed = JSON.parse(msg);
          agentName = parsed.agent || "suggest";
        } catch {}
      }
      setAgent(agentName);

      // Call the selected agent
      const agentRes = await fetch(`/api/agents/${agentName}`);
      const agentData = await agentRes.json();
      setResult(agentData.result || agentData.message);
    } catch (err) {
      setResult("❌ Error handling response.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎤 Flex Voice Agent</h1>
      <VoiceRecorder onTranscription={handleTranscription} />

      {loading && <p>🔄 Thinking...</p>}

      {transcript && (
        <div className="mt-4">
          <strong>Transcript:</strong>
          <p>{transcript}</p>
        </div>
      )}

      {agent && (
        <div className="mt-4">
          <strong>Routed Agent:</strong>
          <p>{agent}</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <strong>Agent Response:</strong>
          <ul className="list-disc pl-5">
            {Array.isArray(result) ? (
              result.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>{result}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 