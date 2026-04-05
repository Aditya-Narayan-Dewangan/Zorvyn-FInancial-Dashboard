import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './StatsGrid.css';

const StatCard = ({ title, value, icon: Icon, trend, type }) => {
    const isPositive = trend > 0;

    return (
        <div className={`stat-card glass ${type}`}>
            <div className="stat-header">
                <div className={`stat-icon ${type}`}>
                    <Icon size={24} />
                </div>
                <div className={`trend-badge ${isPositive ? 'up' : 'down'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            <div className="stat-info">
                <p className="stat-title">{title}</p>
                <h3 className="stat-value">
                    ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
            </div>
        </div>
    );
};

const StatsGrid = () => {
    const { stats } = useDashboard();

    const cards = [
        {
            title: 'Total Balance',
            value: stats.totalBalance,
            icon: Wallet,
            trend: 12.5,
            type: 'balance'
        },
        {
            title: 'Total Income',
            value: stats.totalIncome,
            icon: TrendingUp,
            trend: 8.2,
            type: 'income'
        },
        {
            title: 'Total Expenses',
            value: stats.totalExpenses,
            icon: TrendingDown,
            trend: -5.4,
            type: 'expense'
        },
        {
            title: 'Savings Rate',
            value: (stats.totalBalance / (stats.totalIncome || 1)) * 100,
            icon: DollarSign,
            trend: 2.1,
            type: 'savings'
        }
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
};

export default StatsGrid;
