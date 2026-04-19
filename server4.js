const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // change if needed
  password: 'Museum@1234', // change if needed
  database: 'museum_data'
});

// Configure your transporter (use your real email and app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rpa349project@gmail.com',
    pass: 'snkt tyhk srod afbh'
  }
});

// Function to send food order email
async function sendFoodOrderMail({ email, username, order_id, food_items, total_amount, transaction_number }) {
  const itemsList = JSON.parse(food_items).map(item => `- ${item.item} (₹${item.price}) from ${item.restaurant}`).join('<br>');
  const mailOptions = {
    from: 'rpa349project@gmail.com',
    to: email,
    subject: 'Your Food Order Confirmation',
    html: `
      <h2>Thank you for your order, ${username}!</h2>
      <p><b>Order ID:</b> ${order_id}</p>
      <p><b>Transaction Number:</b> ${transaction_number}</p>
      <p><b>Items:</b><br>${itemsList}</p>
      <p><b>Total Amount:</b> ₹${total_amount}</p>
      <p>Your food will be ready soon. Enjoy your meal!</p>
    `
  };
  await transporter.sendMail(mailOptions);
}

// Endpoint for food_order_info table
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

// Endpoint for food_info table
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

// Endpoint for foodie_info table
app.post('/api/foodie-info', async (req, res) => {
  const { order_id, username, email, food_items, total_amount, transaction_number } = req.body;
  try {
    await db.query(
      'INSERT INTO foodie_info (order_id, username, email, food_items, total_amount, transaction_number) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, username, email, JSON.stringify(food_items), total_amount, transaction_number]
    );
    // Send email after successful insert
    await sendFoodOrderMail({ email, username, order_id, food_items: JSON.stringify(food_items), total_amount, transaction_number });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Endpoint for menu_info table
app.get('/api/menu-info', async (req, res) => {
  const { item } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM menu_info WHERE item = ?', [item]);
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.json({ success: false, message: 'Item not found' });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(3005, () => console.log('Food booking server running on port 3005'));