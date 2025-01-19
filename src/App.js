import React, { useState } from 'react';
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
    ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const searchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/books/search?query=${searchQuery}`);
            const data = await response.json();
            setSearchResults(data.items || []);
        } catch (error) {
            console.error('Error searching books:', error);
        }
    };

    const addToReadingList = async (book) => {
        try {
            const response = await fetch(`${API_URL}/api/reading-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: book.id,
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors,
                    thumbnail: book.volumeInfo.imageLinks?.thumbnail
                }),
            });
            const data = await response.json();
            setReadingList([...readingList, data]);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">BestReads</Typography>
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
                                            >
                                                Add to Reading List
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
                                    <ListItemText
                                        primary={book.title}
                                        secondary={book.authors?.join(', ')}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App; 