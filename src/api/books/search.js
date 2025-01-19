const handler = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { query } = req.query;

        if (!query) {
            res.status(400).json({ error: 'Query parameter is required' });
            return;
        }

        const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
        if (!GOOGLE_BOOKS_API_KEY) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default handler; 