// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disallow default body parsing
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'uploads'); // Ensure this directory exists

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = UPLOAD_DIR; // Set the upload directory

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    // Move the file to the desired location
    const oldPath = files.file.path;
    const newPath = path.join(UPLOAD_DIR, files.file.name);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'File storage failed' });
      }
      res.status(200).json({ message: 'File uploaded successfully' });
    });
  });
}

