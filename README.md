# BestReads

A lightweight web application that helps you track your reading list. Built with React, Node.js, and the Google Books API.

## Features

- Search for books using the Google Books API
- View book details including cover images
- Add books to your personal reading list
- Modern, responsive UI built with Material-UI

## Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd bestreads
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Get a Google Books API key from the [Google Cloud Console](https://console.cloud.google.com)
- Add your API key to the `.env` file

4. Start the development servers
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run client
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Frontend: React, Material-UI
- Backend: Node.js, Express
- API: Google Books API
- Development: Nodemon, Concurrently 