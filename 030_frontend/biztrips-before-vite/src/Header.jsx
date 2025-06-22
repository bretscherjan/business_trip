import React, { useState } from "react";

export default function Header({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav>
        <ul className={isMenuOpen ? "nav-open" : ""}>
          <li className="logo">
            <img width="150px" alt="Business Trips" src="/images/logo.png" />
          </li>
          
          <li className="nav-item">
            <a href="/" className="nav-link">
              <span className="nav-text">Dashboard</span>
            </a>
          </li>
          
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <a href="/login" className="nav-link login-link">
                  <span className="nav-text">Login</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/register" className="nav-link register-link">
                  <span className="nav-text">Registrieren</span>
                </a>
              </li>
            </>
          )}
          
          {isLoggedIn && (
            <li className="nav-item">
              <button className="btn logout-btn" onClick={onLogout}>
                <span className="nav-text">Logout</span>
              </button>
            </li>
          )}
          
          <li className="menu-toggle">
            <button 
              className="menu-btn" 
              onClick={toggleMenu}
              aria-label="Menü öffnen/schließen"
            >
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
