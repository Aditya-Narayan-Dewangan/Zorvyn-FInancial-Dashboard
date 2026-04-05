import React, { useState } from 'react';
import { X, Download, FileJson, FileText, CheckCircle2 } from 'lucide-react';
import { formatDateForUI, formatDateRange } from '../utils/format';
import './DownloadModal.css';

const DownloadModal = ({ isOpen, onClose, data, filters }) => {
    const [format, setFormat] = useState('csv');
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen) return null;

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        const header = Object.keys(array[0]).join(',') + '\r\n';
        str += header;

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    };

    const handleDownload = () => {
        setIsDownloading(true);

        setTimeout(() => {
            let content = '';
            let contentType = '';
            let fileName = `transactions_${filters.dateRange.startDate}_to_${filters.dateRange.endDate}`;

            if (format === 'json') {
                content = JSON.stringify(data, null, 2);
                contentType = 'application/json';
                fileName += '.json';
            } else {
                content = convertToCSV(data);
                contentType = 'text/csv';
                fileName += '.csv';
            }

            const blob = new Blob([content], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setIsDownloading(false);
            onClose();
        }, 800); // Slight delay for UX "processing" feel
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="download-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <Download size={20} className="primary-icon" />
                        <h3>Export Transactions</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="summary-card">
                        <div className="summary-item">
                            <span className="label">Total Records:</span>
                            <span className="value">{data.length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Date Range:</span>
                            <span className="value">{formatDateRange(filters.dateRange.startDate, filters.dateRange.endDate)}</span>
                        </div>
                        <p className="hint-text">
                            You will get the data from {formatDateForUI(filters.dateRange.startDate)} to {formatDateForUI(filters.dateRange.endDate)} based on your current filters.
                        </p>
                    </div>

                    <div className="format-selection">
                        <label>Select Format</label>
                        <div className="format-options">
                            <div
                                className={`format-card ${format === 'csv' ? 'active' : ''}`}
                                onClick={() => setFormat('csv')}
                            >
                                <FileText size={24} />
                                <span>CSV</span>
                                {format === 'csv' && <CheckCircle2 size={16} className="check-icon" />}
                            </div>
                            <div
                                className={`format-card ${format === 'json' ? 'active' : ''}`}
                                onClick={() => setFormat('json')}
                            >
                                <FileJson size={24} />
                                <span>JSON</span>
                                {format === 'json' && <CheckCircle2 size={16} className="check-icon" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className="download-confirm-btn"
                        onClick={handleDownload}
                        disabled={isDownloading || data.length === 0}
                    >
                        {isDownloading ? 'Preparing...' : `Download ${format.toUpperCase()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
