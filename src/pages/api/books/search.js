import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.query;
    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
} 