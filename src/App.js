import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';

function App() {
    console.log('App is rendering, checking environment:', {
        supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'set' : 'not set',
        supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'set' : 'not set'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const { user, signOut } = useAuth();
    const API_URL = process.env.REACT_APP_API_URL;

    // Load reading list when component mounts or user changes
    useEffect(() => {
        if (user) {
            loadReadingList();
        }
    }, [user]);

    // Remove hash from URL after authentication
    useEffect(() => {
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, []);

    const loadReadingList = async () => {
        try {
            const { data, error } = await supabase
                .from('reading_lists')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setReadingList(data || []);
        } catch (error) {
            console.error('Error loading reading list:', error);
            setNotification({
                open: true,
                message: 'Error loading reading list',
                severity: 'error'
            });
        }
    };

    const searchBooks = async () => {
        try {
            const response = await fetch(`/api/books/search?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setSearchResults(data.items || []);
        } catch (error) {
            console.error('Error searching books:', error);
            setNotification({
                open: true,
                message: 'Error searching books',
                severity: 'error'
            });
        }
    };

    const addToReadingList = async (book) => {
        try {
            const { data, error } = await supabase
                .from('reading_lists')
                .insert([
                    {
                        user_id: user.id,
                        book_id: book.id,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors,
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                        status: 'to_read'
                    }
                ])
                .select();

            if (error) throw error;

            setReadingList([...readingList, data[0]]);
            setNotification({
                open: true,
                message: 'Book added to reading list',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding book:', error);
            setNotification({
                open: true,
                message: 'Error adding book to reading list',
                severity: 'error'
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // If user is not authenticated, show auth component
    if (!user) {
        return <Auth />;
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>BestReads</Typography>
                    <IconButton color="inherit" onClick={signOut}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        <Typography variant="h5" gutterBottom>Search Books</Typography>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search for books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
                            />
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={searchBooks}
                            >
                                Search
                            </Button>
                        </div>

                        <Grid container spacing={2}>
                            {searchResults.map((book) => (
                                <Grid item xs={12} sm={6} key={book.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{book.volumeInfo.title}</Typography>
                                            <Typography color="textSecondary">
                                                {book.volumeInfo.authors?.join(', ')}
                                            </Typography>
                                            {book.volumeInfo.imageLinks?.thumbnail && (
                                                <img
                                                    src={book.volumeInfo.imageLinks.thumbnail}
                                                    alt={book.volumeInfo.title}
                                                    style={{ marginTop: '1rem' }}
                                                />
                                            )}
                                            <Button
                                                variant="outlined"
                                                startIcon={<BookmarkAddIcon />}
                                                onClick={() => addToReadingList(book)}
                                                style={{ marginTop: '1rem' }}
                                                disabled={readingList.some(item => item.book_id === book.id)}
                                            >
                                                {readingList.some(item => item.book_id === book.id)
                                                    ? 'Already in List'
                                                    : 'Add to Reading List'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant="h5" gutterBottom>My Reading List</Typography>
                        <List>
                            {readingList.map((book) => (
                                <ListItem key={book.id}>
                                    {book.thumbnail && (
                                        <img
                                            src={book.thumbnail}
                                            alt={book.title}
                                            style={{ width: 50, marginRight: 10 }}
                                        />
                                    )}
                                    <ListItemText
                                        primary={book.title}
                                        secondary={book.authors?.join(', ')}
                                    />
                                </ListItem>
                            ))}
                            {readingList.length === 0 && (
                                <Typography color="textSecondary" align="center">
                                    No books in your reading list yet
                                </Typography>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App; 