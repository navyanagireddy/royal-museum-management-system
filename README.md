# Royal Museum Management System - Nizam's Museum

A comprehensive web-based portal for the Nizam's Museum in Hyderabad. This application features user authentication, ticket booking, event registration, donation management, and a food court ordering system.

## 🚀 Features
- **User Authentication**: Secure Sign-in and Sign-up system.
- **Ticket Booking**: Interactive chatbot for booking museum entry tickets.
- **Event Registration**: Register for upcoming workshops and lectures with PDF ticket generation and QR codes.
- **Donation Portal**: Support the museum through digital donations.
- **Food Court**: Browse menus and order food directly through the portal.
- **Interactive Map**: Explore the layout of the museum.

## 🛠️ Prerequisites
To run this project locally, you need to have the following installed:
1. **Node.js** (v14 or higher)
2. **MySQL Server** (v8.0 or higher)

## 📋 Installation & Setup

### 1. Database Configuration
1. Open your MySQL management tool (like MySQL Workbench).
2. Open and execute the `database_schema.sql` file provided in the root directory. This will create the `museum_data` database and all required tables.
3. Update the database credentials in the following files:
   - `server.js`
   - `server1.js`
   - `server3.js`
   - `server4.js`
   Search for the `password` field and replace `'Museum@1234'` with your local MySQL password.

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Run the Application
You need to start all four backend servers. You can do this easily using the provided batch file:
1. Double-click the `start_all_servers.bat` file.
2. This will open 4 terminal windows running on the following ports:
   - **Port 3000**: Main Server & Tickets
   - **Port 3001**: Donations
   - **Port 3003**: Events
   - **Port 3005**: Food Court

### 4. Access the Website
Once the servers are running, open your browser and navigate to:
[http://localhost:3000/Hhome.html](http://localhost:3000/Hhome.html)

---
*Developed for the preservation and celebration of Hyderabad's Royal Heritage.*
