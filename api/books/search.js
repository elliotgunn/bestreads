import axios from 'axios';

export default async function handler(req, res) {
    console.log('API endpoint hit:', req.method, req.query);

    if (req.method !== 'GET') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.query;
    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    console.log('Searching for:', query);
    console.log('API Key exists:', !!GOOGLE_BOOKS_API_KEY);

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
        );
        console.log('Google Books API response received');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({
            message: 'Error fetching books',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
} 