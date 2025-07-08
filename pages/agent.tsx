import { useState } from "react";
import VoiceRecorder from "../components/VoiceRecorder";

export default function AgentPage() {
  const [transcript, setTranscript] = useState("");
  const [agent, setAgent] = useState("");
  const [result, setResult] = useState<string[] | string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranscription = async (text: string) => {
    setTranscript(text);
    setLoading(true);

    try {
      // 1. Send to MCP router
      const mcpRes = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const mcpData = await mcpRes.json();
      const agentName = extractAgentFromMCP(mcpData);
      setAgent(agentName);

      // 2. Call agent
      const agentRes = await fetch(`/api/agents/${agentName}`);
      const agentData = await agentRes.json();
      setResult(agentData.result || agentData.message);
    } catch (err) {
      setResult("❌ Error handling response.");
    }

    setLoading(false);
  };

  const extractAgentFromMCP = (data: any): string => {
    const msg = data.choices?.[0]?.message?.content;
    try {
      const parsed = JSON.parse(msg);
      return parsed.agent || "suggest";
    } catch {
      return "suggest";
    }
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