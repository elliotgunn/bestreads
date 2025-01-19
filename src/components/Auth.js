import React, { useEffect } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { Container, Paper, Typography } from '@mui/material';

const Auth = () => {
    useEffect(() => {
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event);
            if (session) {
                console.log('Session:', session);
            }
        });

        // Check current session
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Session error:', error);
            }
            if (session) {
                console.log('Current session:', session);
            }
        };

        checkSession();

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

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
                    providers={['google']}
                    theme="dark"
                    onError={(error) => {
                        console.error('Auth error:', error);
                    }}
                />
            </Paper>
        </Container>
    );
};

export default Auth; 