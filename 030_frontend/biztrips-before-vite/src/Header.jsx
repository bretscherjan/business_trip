import React from "react";

export default function Header({ isLoggedIn, onLogout }) {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <img width="150px" alt="Business Trips" src="/images/logo.png" />
          </li>
          <li><a href="/" style={{ color: '#fff', fontWeight: 600 }}>Dashboard</a></li>
          {!isLoggedIn && <li><a href="/login" style={{ color: '#27ae60', fontWeight: 600 }}>Login</a></li>}
          {!isLoggedIn && <li><a href="/register" style={{ color: '#27ae60', fontWeight: 600 }}>Registrieren</a></li>}
          {isLoggedIn && <li><button className="btn" style={{ marginLeft: 12 }} onClick={onLogout}>Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
}
