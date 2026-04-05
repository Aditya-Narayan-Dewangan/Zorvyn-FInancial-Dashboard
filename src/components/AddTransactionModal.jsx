import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { categories } from '../data/mockData';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, editingTransaction }) => {
    const { addTransaction, updateTransaction } = useDashboard();
    const [formData, setFormData] = useState({
        note: '',
        amount: '',
        category: 'Other',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (editingTransaction) {
            setFormData(editingTransaction);
        } else {
            setFormData({
                note: '',
                amount: '',
                category: 'Other',
                type: 'expense',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [editingTransaction, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const transaction = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        if (editingTransaction) {
            updateTransaction(transaction);
        } else {
            addTransaction(transaction);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Entity</label>
                        <input
                            type="text"
                            required
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="e.g. Monthly Rent"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <div className="type-toggle">
                                <button
                                    type="button"
                                    className={formData.type === 'income' ? 'active income' : ''}
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                >
                                    Income
                                </button>
                                <button
                                    type="button"
                                    className={formData.type === 'expense' ? 'active expense' : ''}
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                >
                                    Expense
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
