import React from 'react';
import {
    LayoutDashboard,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    PieChart,
    Settings,
    LogOut,
    Wallet,
    X
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }) => {
    const { role } = useDashboard();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: ArrowUpRight, label: 'Income' },
        { icon: ArrowDownLeft, label: 'Expenses' },
        { icon: CreditCard, label: 'Transactions' },
        { icon: PieChart, label: 'Reports' },
        { icon: Wallet, label: 'Budgets' },
    ];

    return (
        <aside className={`sidebar glass ${isOpen ? 'open' : 'closed'} ${isMobileOpen ? 'mobile-active' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">F</div>
                    <span className={`logo-text ${isOpen ? 'visible' : 'hidden'}`}>FinFlow</span>
                </div>
                <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <div key={index} className={`nav-item ${item.active ? 'active' : ''}`} title={!isOpen ? item.label : ''}>
                        <item.icon size={22} />
                        <span className={`nav-text ${isOpen ? 'visible' : 'hidden'}`}>{item.label}</span>
                        {item.active && <div className="active-indicator" />}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item" title={!isOpen ? 'Settings' : ''}>
                    <Settings size={22} />
                    <span className={`nav-text ${isOpen ? 'visible' : 'hidden'}`}>Settings</span>
                </div>
                <div className="nav-item logout" title={!isOpen ? 'Logout' : ''}>
                    <LogOut size={22} />
                    <span className={`nav-text ${isOpen ? 'visible' : 'hidden'}`}>Logout</span>
                </div>

                <div className={`user-profile glass ${!isOpen ? 'collapsed' : ''}`}>
                    <div className="avatar">AD</div>
                    <div className={`user-info ${isOpen ? 'visible' : 'hidden'}`}>
                        <p className="user-name">Aditya Dewangan</p>
                        <p className="user-role">{role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
