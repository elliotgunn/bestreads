const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

app.use(cors());
app.use(express.json());

// Search books
app.get('/api/books/search', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Get user's reading list (In-memory storage for now)
let readingList = [];

// Add book to reading list
app.post('/api/reading-list', (req, res) => {
    const book = req.body;
    readingList.push(book);
    res.json(book);
});

// Get reading list
app.get('/api/reading-list', (req, res) => {
    res.json(readingList);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 