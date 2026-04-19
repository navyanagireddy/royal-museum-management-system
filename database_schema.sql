-- Museum Project Database Schema
CREATE DATABASE IF NOT EXISTS museum_data;
USE museum_data;

-- User information table
CREATE TABLE IF NOT EXISTS user_info (
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Ticket booking information table
CREATE TABLE IF NOT EXISTS booking_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(100) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    number_of_adults INT DEFAULT 0,
    number_of_children INT DEFAULT 0,
    total_bill_amount DECIMAL(10, 2) NOT NULL,
    bill_date_time DATETIME NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL
);

-- Food order information table
CREATE TABLE IF NOT EXISTS food_order_info (
    order_id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    food_items TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    transaction_number VARCHAR(100) NOT NULL
);

-- Food info table (used for bill text storage)
CREATE TABLE IF NOT EXISTS food_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(100) NOT NULL,
    final_bill_text TEXT NOT NULL,
    username VARCHAR(100) NOT NULL,
    order_id VARCHAR(100) NOT NULL
);

-- Foodie info table (expanded food order info)
CREATE TABLE IF NOT EXISTS foodie_info (
    order_id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    food_items TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    transaction_number VARCHAR(100) NOT NULL
);

-- Donation information table
CREATE TABLE IF NOT EXISTS donars_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    donation_amount DECIMAL(10, 2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registration information table
CREATE TABLE IF NOT EXISTS event_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_token VARCHAR(100) NOT NULL,
    group_ticket_token VARCHAR(100) NOT NULL,
    group_email VARCHAR(100) NOT NULL,
    group_phone VARCHAR(20) NOT NULL,
    person_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    booked_time DATETIME NOT NULL,
    event_name VARCHAR(255) NOT NULL
);

-- Menu information table
CREATE TABLE IF NOT EXISTS menu_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    restaurant VARCHAR(100) NOT NULL
);
