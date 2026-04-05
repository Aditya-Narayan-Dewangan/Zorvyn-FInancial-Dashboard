/**
 * Formats a date string from YYYY-MM-DD to DD-MM-YYYY
 * @param {string} dateStr 
 * @returns {string}
 */
export const formatDateForUI = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
};

/**
 * Returns a human readable date range string
 * @param {string} start 
 * @param {string} end 
 * @returns {string}
 */
export const formatDateRange = (start, end) => {
    return `${formatDateForUI(start)} to ${formatDateForUI(end)}`;
};
