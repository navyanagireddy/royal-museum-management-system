
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Museum@1234', // use your actual password
  database: 'museum_data'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL (donate server)');
});

// Save donation info endpoint
app.post('/api/save-donation', (req, res) => {
  const { fullName, email, donationAmount, message } = req.body;
  console.log('Received donation:', req.body);
  if (!fullName || !email || !donationAmount) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }
  const sql = 'INSERT INTO donars_info (full_name, email, donation_amount, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [fullName, email, donationAmount, message || null], (err, result) => {
    if (err) {
      console.error('Donation save error:', err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// Payment confirmation mail endpoint
app.post('/api/payment-mail', (req, res) => {
  const { email, name, amount } = req.body;
  if (!email || !name || !amount) {
    return res.json({ success: false, message: 'Missing data' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rpa349project@gmail.com',
      pass: 'snkt tyhk srod afbh'
    }
  });

  const mailOptions = {
    from: 'rpa349project@gmail.com',
    to: email,
    subject: 'Thank you for your donation!',
    text: `Dear ${name},\n\nWe have received your donation of ₹${amount}. Thank you for supporting our mission!\n\nBest regards,\nMuseum Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email error:', error);
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(3001, () => {
  console.log('Donate server running on port 3001');
});