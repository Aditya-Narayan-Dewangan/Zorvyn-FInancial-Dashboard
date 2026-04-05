import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { summaryData } from '../data/mockData';
import './ChartsSection.css';

const ChartsSection = () => {
    const { filteredTransactions } = useDashboard();

    // Process data for category breakdown
    const categoryData = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                const existing = acc.find(item => item.name === curr.category);
                if (existing) {
                    existing.value += curr.amount;
                } else {
                    acc.push({ name: curr.category, value: curr.amount });
                }
                return acc;
            }, []);
    }, [filteredTransactions]);

    // Group balance trend by month for the line chart
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map(m => ({ name: m, balance: 0 }));

        filteredTransactions.forEach(t => {
            const date = new Date(t.date);
            const monthIdx = date.getMonth();
            if (monthIdx >= 0 && monthIdx < 12) {
                if (t.type === 'income') {
                    monthlyData[monthIdx].balance += t.amount;
                } else {
                    monthlyData[monthIdx].balance -= t.amount;
                }
            }
        });

        // Calculate cumulative balance
        let cumulative = 0;
        return monthlyData.map(m => {
            cumulative += m.balance;
            return { name: m.name, balance: Math.round(cumulative) };
        });
    }, [filteredTransactions]);

    const COLORS = ['#38bdf8', '#8b5cf6', '#22c55e', '#ef4444', '#f59e0b', '#f472b6', '#a855f7'];

    return (
        <div className="charts-grid">
            <div className="chart-card glass">
                <div className="chart-header">
                    <h3>Balance Trend</h3>
                    <p>Net balance over the last 4 weeks</p>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="balance"
                                stroke="#38bdf8"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorBalance)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-card glass">
                <div className="chart-header">
                    <h3>Spending Breakdown</h3>
                    <p>Distribution by category</p>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                stroke="none"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                                formatter={(value) => `$${value.toFixed(2)}`}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="insights-card glass">
                <h3>Quick Insights</h3>
                <div className="insights-list">
                    <div className="insight-item">
                        <div className="insight-icon top-expense">🔥</div>
                        <div className="insight-text">
                            <p className="label">Highest Spending</p>
                            <p className="value">{categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="insight-item">
                        <div className="insight-icon growth">📈</div>
                        <div className="insight-text">
                            <p className="label">Monthly Growth</p>
                            <p className="value">+15.2%</p>
                        </div>
                    </div>
                    <div className="insight-item">
                        <div className="insight-icon savings">🎯</div>
                        <div className="insight-text">
                            <p className="label">Savings Target</p>
                            <p className="value">82% Reached</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;
