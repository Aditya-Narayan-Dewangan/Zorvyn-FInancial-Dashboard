import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sun, Moon, Menu, Check, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './Navbar.css';

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'info', icon: Info, message: 'Salary credited successfully', time: '2h ago', read: false },
    { id: 2, type: 'warning', icon: AlertTriangle, message: 'Rent payment due in 2d', time: '5h ago', read: false },
    { id: 3, type: 'info', icon: Info, message: 'New login from a new device', time: '1d ago', read: true },
    { id: 4, type: 'danger', icon: AlertCircle, message: 'Groceries budget exceeded', time: '2d ago', read: true },
];

const Navbar = ({ onToggle }) => {
    const { role, setRole, theme, toggleTheme } = useDashboard();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        if (isNotificationOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotificationOpen]);

    return (
        <nav className="navbar glass">
            <button className="sidebar-toggle-btn" onClick={onToggle}>
                <Menu size={24} />
            </button>

            <div className="navbar-actions" style={{ marginLeft: 'auto' }}>
                <div className="role-switcher">
                    <label htmlFor="role-toggle">Role:</label>
                    <select
                        id="role-toggle"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="Admin">Admin (Full Access)</option>
                        <option value="Viewer">Viewer (Read Only)</option>
                    </select>
                </div>

                <div className="notification-container" ref={dropdownRef}>
                    <button
                        className={`icon-btn ${isNotificationOpen ? 'active' : ''}`}
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        title="Notifications"
                    >
                        <Bell size={20} />
                        <span className="dot" />
                    </button>

                    {isNotificationOpen && (
                        <div className="notification-dropdown">
                            <div className="dropdown-header">
                                <h4>Notifications</h4>
                                <button className="mark-read-btn">Mark all as read</button>
                            </div>
                            <div className="dropdown-body">
                                {MOCK_NOTIFICATIONS.map((n) => (
                                    <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                                        <div className={`notification-icon ${n.type}`}>
                                            <n.icon size={16} />
                                        </div>
                                        <div className="notification-content">
                                            <p className="message">{n.message}</p>
                                            <p className="time">{n.time}</p>
                                        </div>
                                        {!n.read && <div className="unread-dot" />}
                                    </div>
                                ))}
                            </div>
                            <div className="dropdown-footer">
                                <button className="view-all-btn">View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                <button className="icon-btn theme-toggle" onClick={(e) => toggleTheme(e)} title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
