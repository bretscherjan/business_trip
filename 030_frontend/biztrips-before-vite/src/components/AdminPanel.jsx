import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const userList = await authService.getAllUsers();
            setUsers(userList);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await authService.updateUserRole(userId, newRole);
            await loadUsers(); // Liste neu laden
            setSelectedUser(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'role-badge admin';
            case 'MANAGER':
                return 'role-badge manager';
            case 'MITARBEITER':
                return 'role-badge employee';
            default:
                return 'role-badge';
        }
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

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading">Lade Benutzer...</div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Benutzerverwaltung</h2>
                <p>Verwalten Sie Benutzer und deren Rollen</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Benutzername</th>
                            <th>E-Mail</th>
                            <th>Name</th>
                            <th>Rolle</th>
                            <th>Erstellt am</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.firstName} {user.lastName}
                                </td>
                                <td>
                                    <span className={getRoleBadgeClass(user.role)}>
                                        {getRoleDisplayName(user.role)}
                                    </span>
                                </td>
                                <td>
                                    {user.createdAt ? 
                                        new Date(user.createdAt).toLocaleDateString('de-DE') : 
                                        '-'
                                    }
                                </td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        Rolle ändern
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal für Rollenänderung */}
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Rolle ändern</h3>
                            <button 
                                className="close-button"
                                onClick={() => setSelectedUser(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Rolle für <strong>{selectedUser.username}</strong> ändern:
                            </p>
                            <div className="role-options">
                                {['MITARBEITER', 'MANAGER', 'ADMIN'].map(role => (
                                    <button
                                        key={role}
                                        className={`role-option ${selectedUser.role === role ? 'active' : ''}`}
                                        onClick={() => handleRoleChange(selectedUser.id, role)}
                                        disabled={selectedUser.role === role}
                                    >
                                        {getRoleDisplayName(role)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel; 