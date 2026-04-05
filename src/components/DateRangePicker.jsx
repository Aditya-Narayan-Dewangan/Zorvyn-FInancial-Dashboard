import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './DateRangePicker.css';

const DateRangePicker = () => {
    const { filters, setFilters, resetFilters } = useDashboard();

    const handleRangeChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [key]: value
            }
        }));
    };

    return (
        <div className="date-picker-container">
            <div className="date-range-picker glass">
                <div className="picker-icon">
                    <Calendar size={18} />
                </div>
                <div className="picker-group">
                    <label>From</label>
                    <input
                        type="date"
                        value={filters.dateRange.startDate}
                        onChange={(e) => handleRangeChange('startDate', e.target.value)}
                        min="2025-01-01"
                        max="2025-12-31"
                    />
                </div>
                <div className="picker-divider" />
                <div className="picker-group">
                    <label>To</label>
                    <input
                        type="date"
                        value={filters.dateRange.endDate}
                        onChange={(e) => handleRangeChange('endDate', e.target.value)}
                        min="2025-01-01"
                        max="2025-12-31"
                    />
                </div>
            </div>

            <button className="reset-btn glass" onClick={resetFilters} title="Reset All Filters">
                <RotateCcw size={18} />
                <span>Reset</span>
            </button>
        </div>
    );
};

export default DateRangePicker;
