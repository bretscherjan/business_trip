import React, { useState } from 'react';
import authService from '../services/authService';
import './Login.css';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData.username, formData.password);
            onLoginSuccess();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Anmelden</h2>
                    <p>Willkommen zurück! Bitte melden Sie sich an.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="username">Benutzername</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Ihr Benutzername"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Passwort</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Ihr Passwort"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Anmelden...' : 'Anmelden'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Noch kein Konto?{' '}
                        <button 
                            type="button" 
                            className="link-button"
                            onClick={onSwitchToRegister}
                        >
                            Jetzt registrieren
                        </button>
                    </p>
                </div>

                <div className="demo-accounts">
                    <h4>Demo-Accounts:</h4>
                    <div className="demo-account">
                        <strong>Admin:</strong> admin / password123
                    </div>
                    <div className="demo-account">
                        <strong>Manager:</strong> manager1 / 123456
                    </div>
                    <div className="demo-account">
                        <strong>Mitarbeiter:</strong> user1 / 123456
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 