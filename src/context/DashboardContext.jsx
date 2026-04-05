import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const DashboardContext = createContext();

const STORAGE_KEY = 'dashboard_filters';
const THEME_KEY = 'dashboard_theme';

const defaultFilters = {
    dateRange: {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
    },
    searchTerm: '',
    categoryFilter: 'All',
    typeFilter: 'All',
    statusFilter: 'All',
    pageSize: 10
};

export const DashboardProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [role, setRole] = useState('Admin');

    // Load persisted theme
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(THEME_KEY) || 'dark';
    });

    // Load persisted filters
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...defaultFilters,
                    ...parsed,
                    dateRange: {
                        ...defaultFilters.dateRange,
                        ...(parsed.dateRange || {})
                    }
                };
            } catch (e) {
                return defaultFilters;
            }
        }
        return defaultFilters;
    });

    // Apply theme and save to localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    // Save filters to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }, [filters]);

    const toggleTheme = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        document.documentElement.dataset.transitionDirection = theme === 'dark' ? 'to-light' : 'to-dark';

        const transition = document.startViewTransition(() => {
            setTheme(nextTheme);
            document.documentElement.style.setProperty('--ripple-x', `${x}px`);
            document.documentElement.style.setProperty('--ripple-y', `${y}px`);
        });

        transition.finished.finally(() => {
            delete document.documentElement.dataset.transitionDirection;
        });
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesDate = t.date >= filters.dateRange.startDate && t.date <= filters.dateRange.endDate;
            const matchesSearch = t.note.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesCategory = filters.categoryFilter === 'All' || t.category === filters.categoryFilter;
            const matchesType = filters.typeFilter === 'All' || t.type === filters.typeFilter;
            const matchesStatus = filters.statusFilter === 'All' || t.status === filters.statusFilter;

            return matchesDate && matchesSearch && matchesCategory && matchesType && matchesStatus;
        });
    }, [transactions, filters]);

    const stats = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const expenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalBalance: income - expenses,
            totalIncome: income,
            totalExpenses: expenses,
        };
    }, [filteredTransactions]);

    const addTransaction = (transaction) => {
        setTransactions(prev => [{ ...transaction, id: Date.now() }, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const updateTransaction = (updatedTransaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    return (
        <DashboardContext.Provider value={{
            transactions,
            role,
            setRole,
            theme,
            toggleTheme,
            filters,
            setFilters,
            resetFilters,
            filteredTransactions,
            stats,
            addTransaction,
            deleteTransaction,
            updateTransaction
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
    return context;
};
