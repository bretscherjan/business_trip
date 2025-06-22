import React, { useState } from 'react';
import authService from '../services/authService';
import './Login.css';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwörter stimmen nicht überein');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Passwort muss mindestens 6 Zeichen lang sein');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await authService.register(registerData);
            onRegisterSuccess();
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
                    <h2>Registrieren</h2>
                    <p>Erstellen Sie Ihr neues Konto</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Vorname</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Vorname"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Nachname</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Nachname"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Benutzername</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Benutzername"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="ihre.email@beispiel.com"
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
                            placeholder="Mindestens 6 Zeichen"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Passwort bestätigen</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Passwort wiederholen"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Registrieren...' : 'Registrieren'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Bereits ein Konto?{' '}
                        <button 
                            type="button" 
                            className="link-button"
                            onClick={onSwitchToLogin}
                        >
                            Jetzt anmelden
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register; 