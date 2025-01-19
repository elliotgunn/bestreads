import React from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { Container, Paper, Typography } from '@mui/material';

const Auth = () => {
    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Welcome to BestReads
                </Typography>
                <Typography variant="body1" gutterBottom align="center">
                    Sign in to manage your reading list
                </Typography>
                <SupabaseAuth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google', 'github']}
                    theme="dark"
                />
            </Paper>
        </Container>
    );
};

export default Auth; 