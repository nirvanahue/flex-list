import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ agent: 'buy', message: 'This is a dummy response from the Buy Now Agent.' });
} 