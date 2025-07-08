import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ agent: 'createList', message: 'This is a dummy response from the Create List Agent.' });
} 