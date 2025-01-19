// Edge Function configuration
export const config = {
    runtime: 'edge',
    regions: ['cle1'], // Cleveland region (closest to you)
};

export default async function handler(req) {
    // Log request details
    console.log('Edge Function hit:', {
        method: req.method,
        url: req.url,
        hasApiKey: !!process.env.GOOGLE_BOOKS_API_KEY
    });

    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ message: 'Method not allowed' }),
            {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }

    try {
        // Parse the URL to get the query parameter
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query) {
            return new Response(
                JSON.stringify({ message: 'Query parameter is required' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
        if (!GOOGLE_BOOKS_API_KEY) {
            console.error('Missing API key in environment');
            return new Response(
                JSON.stringify({ message: 'Server configuration error' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        console.log('Fetching books for query:', query);

        // Fetch books from Google Books API
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Google Books API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Books found:', data.items?.length || 0);

        // Return the response
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Error in Edge Function:', error);
        return new Response(
            JSON.stringify({
                message: 'Error fetching books',
                error: error.message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}