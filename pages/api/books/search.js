import axios from 'axios';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    console.log('API endpoint hit:', req.method, req.query);
    console.log('Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!process.env.GOOGLE_BOOKS_API_KEY
    });

    if (req.method !== 'GET') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.query;
    if (!query) {
        console.log('No query provided');
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    if (!GOOGLE_BOOKS_API_KEY) {
        console.error('Google Books API key is missing');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Searching for:', query);
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`;
    console.log('API URL (without key):', apiUrl.replace(GOOGLE_BOOKS_API_KEY, 'REDACTED'));

    try {
        const response = await axios.get(apiUrl);
        console.log('Google Books API response received:', {
            status: response.status,
            itemCount: response.data?.items?.length
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        res.status(error.response?.status || 500).json({
            message: 'Error fetching books',
            error: error.message,
            details: error.response?.data
        });
    }
} 