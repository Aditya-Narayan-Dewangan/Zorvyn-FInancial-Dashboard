import React, { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import ChartsSection from './components/ChartsSection';
import TransactionsTable from './components/TransactionsTable';
import DateRangePicker from './components/DateRangePicker';
import './App.css';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebar_expanded');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Save sidebar state
    React.useEffect(() => {
        localStorage.setItem('sidebar_expanded', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isMobileMenuOpen]);

    const toggleSidebar = () => {
        if (window.innerWidth <= 1024) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <DashboardProvider>
            <div className="app-container">
                <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    isMobileOpen={isMobileMenuOpen}
                    setIsMobileOpen={setIsMobileMenuOpen}
                />

                {isMobileMenuOpen && (
                    <div
                        className="mobile-overlay"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Navbar onToggle={toggleSidebar} />
                    <div className="dashboard-content">
                        <header className="dashboard-header">
                            <div className="header-top">
                                <div>
                                    <h1 className="gradient-text">Financial Overview</h1>
                                    <p>Track your spending and income in real-time.</p>
                                </div>
                                <DateRangePicker />
                            </div>
                        </header>

                        <StatsGrid />
                        <ChartsSection />
                        <TransactionsTable />
                    </div>
                </main>
            </div>
        </DashboardProvider>
    );
}

export default App;
