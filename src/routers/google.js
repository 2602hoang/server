import express from 'express';
import axios from 'axios';

const router = express.Router();

const send = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, phone, email, address, note, option } = req.body;

      const formData = {
        name,
        phone,
        email,
        address,
        note,
        option
      };

      const targetUrl = 'https://script.google.com/macros/s/AKfycbyjvqU26Nkq1l0Gr8_0YxfsLFsF8g8o2VmAu11rjQiG6YqfYPdGTsdxQBP1r7SHOLab/exec';

      await axios.post(targetUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      console.error('Form submission error:', error);
      res.status(500).json({ message: 'Form submission failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

router.post('/send', send);

export default router;
