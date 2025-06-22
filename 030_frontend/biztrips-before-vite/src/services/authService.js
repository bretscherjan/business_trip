import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const authService = {
    // Login
    async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username,
                password
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('firstName', response.data.firstName);
                localStorage.setItem('lastName', response.data.lastName);
                localStorage.setItem('email', response.data.email);
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Login fehlgeschlagen');
        }
    },

    // Registrierung
    async register(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Registrierung fehlgeschlagen');
        }
    },

    // Logout
    async logout() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_BASE_URL}/logout`, {}, {
                    headers: { Authorization: token }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('email');
        }
    },

    // Benutzerprofil abrufen
    async getUserProfile() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/user/profile`, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Fehler beim Abrufen des Profils');
        }
    },

    // Alle Benutzer abrufen (nur Admin)
    async getAllUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Fehler beim Abrufen der Benutzer');
        }
    },

    // Benutzerrolle aktualisieren (nur Admin)
    async updateUserRole(userId, newRole) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Fehler beim Aktualisieren der Rolle');
        }
    },

    // Token abrufen
    getToken() {
        return localStorage.getItem('token');
    },

    // Benutzername abrufen
    getUsername() {
        return localStorage.getItem('username');
    },

    // Rolle abrufen
    getRole() {
        return localStorage.getItem('role');
    },

    // Vorname abrufen
    getFirstName() {
        return localStorage.getItem('firstName');
    },

    // Nachname abrufen
    getLastName() {
        return localStorage.getItem('lastName');
    },

    // Email abrufen
    getEmail() {
        return localStorage.getItem('email');
    },

    // Prüfen ob eingeloggt
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    // Prüfen ob Admin
    isAdmin() {
        return localStorage.getItem('role') === 'ADMIN';
    },

    // Prüfen ob Manager oder Admin
    isManager() {
        const role = localStorage.getItem('role');
        return role === 'MANAGER' || role === 'ADMIN';
    }
};

export default authService; 