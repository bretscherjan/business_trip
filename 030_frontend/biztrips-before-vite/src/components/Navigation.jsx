import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();
    const isAdmin = authService.isAdmin();
    const isManager = authService.isManager();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                
                {isManager && (
                    <Link 
                        to="/trips" 
                        className={`nav-link ${isActive('/trips') ? 'active' : ''}`}
                    >
                        Reisen verwalten
                    </Link>
                )}
                
                {isAdmin && (
                    <Link 
                        to="/admin" 
                        className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    >
                        Benutzerverwaltung
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navigation; 