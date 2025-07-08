import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set in environment' });
  }

  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Missing transcript in request body' });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a gift suggestion agent. Suggest a gift based on the user's request." },
          { role: "user", content: transcript }
        ]
      })
    });

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "No suggestion found.";
    res.status(200).json({ agent: 'suggest', message: suggestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestion', details: (err as Error).message });
  }
} 