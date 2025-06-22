import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import authService from "./services/authService";

// Dashboard-Komponente (ursprüngliche App-Funktionalität)
const Dashboard = ({ currentUser }) => {
  const trips = [
    {
      id: 1,
      title: "BT01",
      description: "San Francisco World Trade Center on new Server/IOT/Client ",
      startTrip: [2021, 2, 13, 0, 0],
      endTrip: [2021, 2, 15, 16, 56],
      meetings: [
        {
          id: 1,
          title: "One Conference",
          description: "Key Note on One Conference",
        },
        {
          id: 2,
          title: "Zero Conference",
          description: "Workshop Zero on One Conference",
        },
      ],
    },
    {
      id: 2,
      title: "BT02",
      description: "Santa Clara Halley on new Server/IOT/Client",
      startTrip: [2021, 6, 23, 9, 0],
      endTrip: [2021, 6, 27, 16, 56],
      meetings: [
        {
          id: 3,
          title: "One Conference",
          description: "HandsOn on One Conference",
        },
        {
          id: 4,
          title: "One Conference",
          description: "Key Note on One Conference",
        },
      ],
    },
    {
      id: 3,
      title: "BT03",
      description: "San Cose City Halley on Docker/IOT/Client",
      startTrip: [2021, 12, 13, 9, 0],
      endTrip: [2021, 12, 15, 16, 56],
      meetings: [
        {
          id: 5,
          title: "One Conference",
          description: "Key Note on One Conference",
        },
      ],
    },
  ];

  function renderTrip(t) {
    return (
      <div className="product" key={t.id}>
        <figure>
          <div>
            <img src={"images/items/" + t.id + ".jpg"} alt="name " />
          </div>
          <figcaption>
            <a href="#. . . ">{t.title}</a>
            <div>
              <span>
                {t.startTrip[2] + "-" + t.startTrip[1] + "-" + t.startTrip[0]}
              </span>
            </div>
            <p>{t.description}</p>
            <div>
              <button type="button" disabled>
                Add to Triplist
              </button>
            </div>
          </figcaption>
        </figure>
      </div>
    );
  }

  return (
    <main>
      <section id="filters">
        <label htmlFor="month">Filter by Month:</label>{" "}
        <select id="size">
          <option value="">All months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
        </select>
      </section>
      <section id="products">{trips.map(renderTrip)}</section>
    </main>
  );
};

// Geschützte Route-Komponente
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isLoggedIn = authService.isLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRole = authService.getRole();
    if (requiredRole === 'ADMIN' && !authService.isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'MANAGER' && !authService.isManager()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Prüfe beim Start, ob ein Token vorhanden ist
    if (authService.isLoggedIn()) {
      setIsAuthenticated(true);
      setCurrentUser({
        username: authService.getUsername(),
        role: authService.getRole()
      });
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentUser({
      username: authService.getUsername(),
      role: authService.getRole()
    });
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
    // Zeige Erfolgsmeldung
    alert('Registrierung erfolgreich! Bitte melden Sie sich an.');
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  // Wenn nicht authentifiziert, zeige Login/Register
  if (!isAuthenticated) {
    return (
      <div className="App">
        {showLogin ? (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <Register 
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    );
  }

  // Wenn authentifiziert, zeige die App mit Routing
  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} currentUser={currentUser} />
        
        <Routes>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard currentUser={currentUser} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}
