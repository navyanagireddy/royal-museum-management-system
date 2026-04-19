const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Museum@1234',
  database: 'museum_data'
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, phone, password } = req.body;
  const last4 = phone.slice(-4);
  const user_id = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0,14) + last4;

  try {
    const [results] = await db.query('SELECT * FROM user_info WHERE username = ?', [username]);
    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    await db.query(
      'INSERT INTO user_info (user_id, username, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [user_id, username, email, phone, password]
    );
    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err });
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await db.query(
      'SELECT * FROM user_info WHERE username = ? AND password = ?',
      [username, password]
    );
    if (results.length > 0) {
      // Return all user info for localStorage
      res.json({
        message: 'Signin successful',
        username: results[0].username,
        user_id: results[0].user_id,
        email: results[0].email,
        phone: results[0].phone,
        password: results[0].password
      });
    } else {
      res.json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.json({ message: 'Signin failed', error: err.message });
  }
});

// Ticket booking confirmation email
async function sendTicketBookingMail({ email, username, adults, children, total_amount, transaction_id, bill_date_time }) {
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
    subject: 'Your Museum Ticket Booking Confirmation',
    html: `
      <h2>Thank you for booking tickets, ${username}!</h2>
      <p><strong>Booking Date & Time:</strong> ${bill_date_time}</p>
      <p><strong>Transaction ID:</strong> ${transaction_id}</p>
      <ul>
        <li>${adults} Adults (₹${adults * 80})</li>
        <li>${children} Children (₹${children * 50})</li>
      </ul>
      <p><strong>Total Amount:</strong> ₹${total_amount}</p>
      <hr>
      <h3>Important Information:</h3>
      <ul>
        <li>Please arrive 15 minutes before your visit</li>
        <li>Show this email or transaction ID at the counter</li>
        <li>Children must be accompanied by adults</li>
      </ul>
      <p>We look forward to welcoming you!</p>
      <p><em>Welcome to the Museum Family!</em></p>
      <p>Best regards,<br>Museum Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

// Book tickets endpoint
app.post('/api/book-tickets', async (req, res) => {
  const { username, user_id, email, phone, number_of_adults, number_of_children, total_bill_amount, bill_date_time, transaction_id } = req.body;

  if (!username || !user_id || !email || !phone || number_of_adults == null || number_of_children == null || !total_bill_amount || !bill_date_time || !transaction_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `INSERT INTO booking_info (user, user_id, email, phone, number_of_adults, number_of_children, total_bill_amount, bill_date_time, transaction_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(sql, [username, user_id, email, phone, number_of_adults, number_of_children, total_bill_amount, bill_date_time, transaction_id]);
    try {
      await sendTicketBookingMail({ 
        email, 
        username, 
        adults: number_of_adults, 
        children: number_of_children, 
        total_amount: total_bill_amount, 
        transaction_id, 
        bill_date_time 
      });
      res.json({ success: true, message: 'Booking successful' });
    } catch (emailError) {
      res.json({ success: true, message: 'Booking saved but email failed' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

// Food order endpoint
app.post('/api/food-order', async (req, res) => {
  const { order_id, username, food_items, total_amount, transaction_number } = req.body;
  try {
    await db.query(
      'INSERT INTO food_order_info (order_id, username, food_items, total_amount, transaction_number) VALUES (?, ?, ?, ?, ?)',
      [order_id, username, JSON.stringify(food_items), total_amount, transaction_number]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Food info endpoint
app.post('/api/food-info', async (req, res) => {
  const { transaction_number, final_bill_text, username, order_id } = req.body;
  try {
    await db.query(
      'INSERT INTO food_info (transaction_number, final_bill_text, username, order_id) VALUES (?, ?, ?, ?)',
      [transaction_number, final_bill_text, username, order_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Foodie info endpoint
app.post('/api/foodie-info', async (req, res) => {
  const { order_id, username, email, food_items, total_amount, transaction_number } = req.body;
  try {
    await db.query(
      'INSERT INTO foodie_info (order_id, username, email, food_items, total_amount, transaction_number) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, username, email, JSON.stringify(food_items), total_amount, transaction_number]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));