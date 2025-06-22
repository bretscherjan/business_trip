import React from 'react';
import authService from './services/authService';
import './Header.css';

const Header = ({ onLogout, currentUser }) => {
    const handleLogout = () => {
        onLogout();
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'Administrator';
            case 'MANAGER':
                return 'Manager';
            case 'MITARBEITER':
                return 'Mitarbeiter';
            default:
                return role;
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <img src="/images/logo.png" alt="Business Trips Logo" />
                    <h1>Business Trips</h1>
                </div>
                
                {currentUser && (
                    <div className="user-info">
                        <div className="user-details">
                            <span className="username">{currentUser.username}</span>
                            <span className="role">{getRoleDisplayName(currentUser.role)}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Abmelden
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
