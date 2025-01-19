# BestReads

A modern web application that helps you discover and track your reading list. Built with React, Supabase, and the Google Books API, deployed on Vercel.

## Features

- Search for books using the Google Books API
- Secure authentication with Google Sign-In
- Personal reading list management
- Book details including cover images and authors
- Modern, responsive UI built with Material-UI
- Real-time feedback and error handling

## Architecture

BestReads uses a modern serverless architecture:

### Frontend
The React-based frontend provides a responsive user interface with Material-UI components. It handles book searches, displays results, and manages the reading list. User authentication is implemented using Supabase Auth UI with Google OAuth integration.

### Backend
A serverless Node.js function hosted on Vercel handles communication with the Google Books API. This architecture eliminates the need for a traditional server while maintaining secure API key management and proper error handling.

### Database
Supabase provides a PostgreSQL database for storing user reading lists and a complete authentication system. This gives us the power of a full-featured database without the operational overhead.

### Deployment
The entire application is deployed on Vercel's edge network, ensuring fast response times and reliable performance. Environment variables securely store API keys and configuration details.

## Technologies Used

- **Frontend**: React, Material-UI, Supabase Auth UI
- **Backend**: Vercel Serverless Functions, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth via Supabase Auth
- **API**: Google Books API
- **Deployment**: Vercel
- **Development**: Git, GitHub

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/bestreads.git
cd bestreads
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Create a project in [Google Cloud Console](https://console.cloud.google.com)
- Set up a [Supabase](https://supabase.com) project
- Add the following to your `.env`:
  - `GOOGLE_BOOKS_API_KEY`
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`

4. Set up Supabase
- Create a new project
- Enable Google Auth
- Create a `reading_lists` table with the following schema:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `book_id` (text)
  - `title` (text)
  - `authors` (text[])
  - `thumbnail` (text)
  - `status` (text)

5. Start the development server
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Data Flow

1. Users authenticate via Google OAuth through Supabase
2. Frontend makes search requests to the Vercel serverless function
3. The function securely calls Google Books API
4. Users can add books to their reading list
5. Reading list data is stored in Supabase PostgreSQL
6. Lists are automatically loaded on authentication

## Security

- CORS protection on API endpoints
- Secure environment variable management
- OAuth 2.0 authentication
- JWT session management
- Protected database access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 