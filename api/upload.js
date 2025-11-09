// api/upload.js
import { put } from '@vercel/blob';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const bb = Busboy({ headers: req.headers });

  bb.on('file', async (name, file, info) => {
    const { filename } = info;
    const chunks = [];
    
    file.on('data', (chunk) => chunks.push(chunk));

    file.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      const blob = await put(`audit/${Date.now()}-${filename}`, buffer, {
        access: 'public'
      });

      return res.status(200).json({ url: blob.url });
    });
  });

  req.pipe(bb);
}
