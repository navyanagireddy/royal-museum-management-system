# Museum Backend API

## Overview
This project is a backend API for a museum website. It connects to a MySQL database named `museum_data` and provides endpoints to manage and retrieve museum-related data.

## Technologies Used
- Node.js
- Express.js
- MySQL

## Project Structure
```
museum-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── database.js       # Database connection configuration
│   ├── controllers
│   │   └── museumController.js # Controller for handling museum data requests
│   ├── models
│   │   └── museumModel.js     # Model defining the structure of museum data
│   ├── routes
│   │   └── museumRoutes.js     # Routes for museum-related endpoints
│   └── types
│       └── index.d.ts         # TypeScript interfaces for museum data
├── package.json               # NPM configuration file
└── README.md                  # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd museum-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in `src/config/database.js` to connect to your MySQL `museum_data` database.

4. Start the application:
   ```
   npm start
   ```

## API Usage
- **GET /museums**: Retrieve a list of all museums.
- **GET /museums/:id**: Retrieve details of a specific museum by ID.

## License
This project is licensed under the MIT License.