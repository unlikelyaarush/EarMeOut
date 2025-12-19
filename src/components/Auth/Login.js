import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Iridescence from '../Iridescence';
import Footer from '../Footer';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if(error) {
            setError(error.message);
        }
        else {
         navigate('/chat')
        }

        setLoading(false);
    };

    return(
    <div className="auth-container">
      <Iridescence
        color={[0, .3, .5]}
        mouseReact={false}
        amplitude={0.1}
        speed={.4}
      />
        <div className="auth-card">
            <h2>Login to EarMeOut</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
            <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                />
            </div>
            <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>
            <p className="auth-switch">
            Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
        <Footer />
        </div>
    );
};

export default Login;