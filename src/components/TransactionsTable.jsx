import React, { useState, useMemo } from 'react';
import {
    Plus,
    Search,
    Filter,
    Trash2,
    Edit3,
    Download,
    ArrowUpCircle,
    ArrowDownCircle,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { categories } from '../data/mockData';
import { formatDateForUI } from '../utils/format';
import AddTransactionModal from './AddTransactionModal';
import DownloadModal from './DownloadModal';
import './TransactionsTable.css';

const TransactionsTable = () => {
    const {
        filteredTransactions,
        transactions,
        role,
        deleteTransaction,
        updateTransaction,
        filters,
        setFilters,
        resetFilters
    } = useDashboard();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const isAdmin = role === 'Admin';
    const allCategories = [...categories];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Sorting Logic
    const sortedTransactions = useMemo(() => {
        let sortableItems = [...filteredTransactions];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (sortConfig.key === 'amount') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }

                if (sortConfig.key === 'date') {
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }

                // Default string comparison (Status, etc)
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTransactions, sortConfig]);

    // Pagination Calculation
    const pageSize = filters.pageSize || 10;
    const totalPages = Math.ceil(sortedTransactions.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + pageSize);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    return (
        <div className="table-section glass">
            <div className="table-header">
                <div className="header-info">
                    <h3>Recent Transactions</h3>
                    <p>You have {filteredTransactions.length} transactions</p>
                </div>
                <div className="table-actions">
                    <div className="filter-group">
                        <div className="search-input">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            />
                        </div>
                        <select
                            value={filters.categoryFilter}
                            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Categories</option>
                            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filters.typeFilter}
                            onChange={(e) => handleFilterChange('typeFilter', e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <select
                            value={filters.statusFilter}
                            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {isAdmin && (
                        <button className="add-btn" onClick={handleAddNew}>
                            <Plus size={18} />
                            <span>Add New</span>
                        </button>
                    )}

                    <button
                        className="icon-btn-outline"
                        title={sortedTransactions.length === 0 ? "No data to export" : "Export data"}
                        onClick={() => setIsDownloadModalOpen(true)}
                        disabled={sortedTransactions.length === 0}
                    >
                        <Download size={18} />
                    </button>

                    <button className="icon-btn-outline mobile-only-reset" onClick={resetFilters} title="Reset All Filters">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Entity</th>
                            <th>Category</th>
                            <th className="sortable-header" onClick={() => handleSort('date')}>
                                <div className="header-content">
                                    Date
                                    <span className="sort-icon">
                                        {sortConfig.key === 'date' ? (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                        ) : <ChevronsUpDown size={14} />}
                                    </span>
                                </div>
                            </th>
                            <th className="sortable-header" onClick={() => handleSort('amount')}>
                                <div className="header-content">
                                    Amount
                                    <span className="sort-icon">
                                        {sortConfig.key === 'amount' ? (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                        ) : <ChevronsUpDown size={14} />}
                                    </span>
                                </div>
                            </th>
                            <th>Status</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="empty-state">
                                    No transactions found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        <div className="desc-cell">
                                            <div className={`type-icon ${t.type}`}>
                                                {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                            </div>
                                            <span>{t.note}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{t.category}</span>
                                    </td>
                                    <td>{formatDateForUI(t.date)}</td>
                                    <td>
                                        <span className={`amount ${t.type}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${t.status.toLowerCase()}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn edit" onClick={() => handleEdit(t)} title="Edit">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="action-btn delete" onClick={() => deleteTransaction(t.id)} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <div className="footer-main">
                    <span className="page-info">
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredTransactions.length)} of {filteredTransactions.length}
                    </span>

                    <div className="page-size-selector">
                        <label>Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => handleFilterChange('pageSize', Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="pagination-btns">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="page-numbers">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    className={`page-num ${currentPage === p ? 'active' : ''}`}
                                    onClick={() => goToPage(p)}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        {totalPages > 5 && <span className="dots">...</span>}
                        {totalPages > 5 && (
                            <button
                                className={`page-num ${currentPage === totalPages ? 'active' : ''}`}
                                onClick={() => goToPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        )}
                    </div>
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    editingTransaction={editingTransaction}
                />
            )}
            {isDownloadModalOpen && (
                <DownloadModal
                    isOpen={isDownloadModalOpen}
                    onClose={() => setIsDownloadModalOpen(false)}
                    data={filteredTransactions}
                    filters={filters}
                />
            )}
        </div>
    );
};

export default TransactionsTable;
