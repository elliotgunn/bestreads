// Edge Function configuration
export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers }
        );
    }

    try {
        const url = new URL(req.url);
        const query = url.searchParams.get('query');

        if (!query) {
            return new Response(
                JSON.stringify({ error: 'Query parameter is required' }),
                { status: 400, headers }
            );
        }

        const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
        if (!GOOGLE_BOOKS_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { status: 500, headers }
            );
        }

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`
        );

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers }
        );
    }
}