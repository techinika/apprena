import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { data: fileStr } = req.body;
      if (!fileStr) {
        return res.status(400).json({ error: 'No file data provided.' });
      }

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'your_upload_preset',
      });

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
