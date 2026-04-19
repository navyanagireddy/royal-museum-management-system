const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',                
    password: 'Museum@1234',       
    database: 'museum_data'      
};

function generateTicketToken(phone, date) {
    // Format: YYYYMMDDHHMMSS + last 5 digits of phone + 4-char random code
    const pad = n => n < 10 ? '0' + n : n;
    const dt = new Date(date);
    const dtStr = dt.getFullYear().toString() +
        pad(dt.getMonth() + 1) +
        pad(dt.getDate()) +
        pad(dt.getHours()) +
        pad(dt.getMinutes()) +
        pad(dt.getSeconds());
    const last5 = phone.slice(-5);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let rand = '';
    for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
    return dtStr + last5 + rand;
}

async function sendTicketMail({ groupEmail, persons, group_token, base_token, eventName }) {
    const doc = new PDFDocument({ margin: 40 });

    

    // --- Leave one line at the top, then Title (bold, centered) ---
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('black').text(`Tickets for ${eventName}`, {
        align: 'center'
    });

    // --- Two lines gap after title ---
    doc.moveDown(2);
    let y = doc.y;

    // --- Table with double border outside, single inside ---
    const tableTop = y;
    const colWidths = [260, 140, 80]; // Increase Ticket Token column width
    const rowHeight = 32;
    const startX = doc.page.margins.left;

    // Outer double border
    doc.save()
        .lineWidth(3)
        .rect(startX - 4, tableTop - 4, colWidths.reduce((a, b) => a + b, 0) + 8, (persons.length + 1) * rowHeight + 8)
        .stroke('#000')
        .lineWidth(1)
        .rect(startX - 2, tableTop - 2, colWidths.reduce((a, b) => a + b, 0) + 4, (persons.length + 1) * rowHeight + 4)
        .stroke('#000')
        .restore();

    // Table header
    doc.fontSize(13).font('Helvetica-Bold');
    doc.rect(startX, y, colWidths[0], rowHeight).stroke();
    doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight).stroke();
    doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight).stroke();
    doc.text('Ticket Token', startX + 10, y + 8);
    doc.text('Name', startX + colWidths[0] + 10, y + 8);
    doc.text('Age', startX + colWidths[0] + colWidths[1] + 10, y + 8);
    y += rowHeight;

    doc.font('Helvetica').fontSize(12);

    // Table rows
    persons.forEach((person, idx) => {
        let ticket_token = persons.length === 1
            ? base_token
            : `${base_token}.${String(idx + 1).padStart(2, '0')}`;
        doc.rect(startX, y, colWidths[0], rowHeight).stroke();
        doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight).stroke();
        doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight).stroke();
        doc.text(ticket_token, startX + 10, y + 8);
        doc.text(person.personName, startX + colWidths[0] + 10, y + 8);
        doc.text(person.age, startX + colWidths[0] + colWidths[1] + 10, y + 8);
        y += rowHeight;
    });

    // --- Two lines gap after table ---
    doc.y = y;
    doc.moveDown(2);
    

    // --- Welcome Paragraph (left-aligned, tabbed) ---
    doc.fontSize(13).font('Helvetica').fillColor('black');
    doc.text('We warmly welcome you to the event! \nPlease bring this ticket PDF with you for entry.', doc.page.margins.left, doc.y, {
        align: 'center'
    });

    // --- Group Ticket Token for multiple bookings ---
    if (persons.length > 1) {
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black')
            .text(`YOUR GROUP TICKET TOKEN -> ${group_token}`, { align: 'left' });
    }

    // --- 3 lines gap before QR code ---
    doc.moveDown(3);

    // --- QR Code at the last line, centered ---
    const qrValue = group_token; // or any text you want in the QR
    const qrImageSmall = await QRCode.toDataURL(qrValue, { margin: 1, width: 30 });

    // Calculate position: 50px from top and right
    const qrX = doc.page.width - 50 - 30; // 50px from right, 30px width
    const qrY = 50; // 50px from top

    doc.image(qrImageSmall, qrX, qrY, { width: 30, height: 30 });

    doc.end();

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rpa349project@gmail.com',
                pass: 'snkt tyhk srod afbh'
            }
        });

        let mailOptions = {
            from: '"Museum Events" <rpa349project@gmail.com>',
            to: groupEmail,
            subject: `Your Ticket(s) for ${eventName}`,
            text: 'Please find your ticket(s) attached.',
            attachments: [
                {
                    filename: 'tickets.pdf',
                    content: pdfData
                }
            ]
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Ticket email sent to:', groupEmail);
        } catch (err) {
            console.error('Error sending ticket email:', err);
        }
    });
}

app.post('/api/register-event', async (req, res) => {
    const { groupEmail, groupPhone, persons, eventName } = req.body;
    if (!groupEmail || !groupPhone || !Array.isArray(persons) || persons.length === 0 || !eventName) {
        return res.json({ success: false, message: 'Invalid data' });
    }
    const now = new Date();
    const base_token = generateTicketToken(groupPhone, now);
    const group_token = persons.length === 1
        ? base_token
        : `${base_token}*m${persons.length}`;

    try {
        const conn = await mysql.createConnection(dbConfig);
        const insertPromises = persons.map((person, idx) => {
            let person_token;
            if (persons.length === 1) {
                person_token = base_token;
            } else {
                person_token = `${base_token}.${String(idx + 1).padStart(2, '0')}`;
            }
            return conn.execute(
                `INSERT INTO event_info (ticket_token, group_ticket_token, group_email, group_phone, person_name, age, booked_time, event_name)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [person_token, group_token, groupEmail, groupPhone, person.personName, person.age, now, eventName]
            );
        });
        await Promise.all(insertPromises);
        await conn.end();
        await sendTicketMail({
            groupEmail,
            persons,
            group_token,
            base_token,
            eventName
        });
        res.json({ success: true, ticket_token: group_token });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Database error' });
    }
});

app.listen(3003, () => {
    console.log('Server running on http://localhost:3003');
});