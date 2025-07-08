import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set in environment' });
  }

  const formidable = require('formidable');
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = require('fs');
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);
    formData.append('model', 'whisper-large-v3');

    try {
      // 1. Send audio to Groq Whisper
      const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData as any,
      });

      const whisperData = await whisperRes.json();
      const transcript = whisperData.text;

      // 2. Send transcript to MCP (Llama 3)
      const mcpRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // or compound-beta when enabled
          messages: [
            { role: "system", content: "You are a routing MCP. Route user requests to agents: suggest, createList, flex, buy. Return a JSON object with the agent and reason." },
            { role: "user", content: transcript }
          ]
        })
      });

      const mcpData = await mcpRes.json();

      // 3. Return both transcript and MCP response
      res.status(200).json({ transcript, mcpResponse: mcpData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to transcribe or route', details: (error as Error).message });
    }
  });
} 