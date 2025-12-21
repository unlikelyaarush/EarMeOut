import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: {session}}) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((error) => {
            console.error('Error getting session:', error);
            setLoading(false);
        });

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const signUp = async (email, password, metadata = {}) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                    emailRedirectTo: `${window.location.origin}/confirm-email`,
                },
            });
            
            return { data, error };
        } catch (error) {
            console.error('Sign up exception:', error);
            return { data: null, error: { message: error.message || 'Sign up failed' } };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error: { message: error.message || 'Sign in failed' } };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error: { message: error.message || 'Sign out failed' } };
        }
    };

    const resetPassword = async (email) => {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            return { data, error };
        } catch (error) {
            console.error('Reset password error:', error);
            return { data: null, error: { message: error.message || 'Reset password failed' } };
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};