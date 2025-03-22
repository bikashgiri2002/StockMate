import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();




// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
connectDB()
.then(() => {
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
}).catch((err) => console.log(err.message))
