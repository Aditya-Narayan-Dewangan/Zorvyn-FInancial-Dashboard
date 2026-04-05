export const categories = [
    'Groceries',
    'Rent',
    'Utilities',
    'Salary',
    'Healthcare',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Interest',
    'Dividends',
    'Other'
];

const generateMockData = () => {
    const transactions = [];
    const start = new Date('2025-01-01');
    const end = new Date('2025-12-31');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const day = d.getDate();

        const getStatus = () => {
            const rand = Math.random();
            if (rand > 0.95) return 'Cancelled';
            if (rand > 0.8) return 'Pending';
            return 'Completed';
        };

        // Monthly Salary (1st)
        if (day === 1) {
            transactions.push({
                id: `salary-${dateStr}`,
                date: dateStr,
                note: 'Monthly Salary',
                amount: 5000,
                category: 'Salary',
                type: 'income',
                status: 'Completed' // Salaries are always completed
            });
        }

        // Monthly Rent (5th)
        if (day === 5) {
            transactions.push({
                id: `rent-${dateStr}`,
                date: dateStr,
                note: 'House Rent',
                amount: 1500,
                category: 'Rent',
                type: 'expense',
                status: getStatus()
            });
        }

        // Monthly Utilities (10th)
        if (day === 10) {
            transactions.push({
                id: `util-${dateStr}`,
                date: dateStr,
                note: 'Utility Bills',
                amount: 100 + Math.random() * 80,
                category: 'Utilities',
                type: 'expense',
                status: getStatus()
            });
        }

        // Daily Randomness
        if (Math.random() > 0.4) {
            const isGroceries = Math.random() > 0.5;
            transactions.push({
                id: `daily-${dateStr}-${Math.random()}`,
                date: dateStr,
                note: isGroceries ? 'Whole Foods' : 'Uber Ride',
                amount: isGroceries ? 50 + Math.random() * 100 : 15 + Math.random() * 30,
                category: isGroceries ? 'Groceries' : 'Transportation',
                type: 'expense',
                status: getStatus()
            });
        }

        // Weekly Entertainment (Sundays)
        if (d.getDay() === 0) {
            transactions.push({
                id: `ent-${dateStr}`,
                date: dateStr,
                note: 'Restaurant & Movie',
                amount: 100 + Math.random() * 150,
                category: 'Entertainment',
                type: 'expense',
                status: getStatus()
            });
        }

        // Quarterly Dividends
        if ([2, 5, 8, 11].includes(d.getMonth()) && day === 15) {
            transactions.push({
                id: `div-${dateStr}`,
                date: dateStr,
                note: 'Investment Dividends',
                amount: 400 + Math.random() * 200,
                category: 'Dividends',
                type: 'income',
                status: 'Completed'
            });
        }
    }

    return transactions;
};

export const mockTransactions = generateMockData();

export const summaryData = [
    { name: 'Jan', balance: 3500 },
    { name: 'Feb', balance: 3900 },
    { name: 'Mar', balance: 4200 },
    { name: 'Apr', balance: 4100 },
    { name: 'May', balance: 4500 },
    { name: 'Jun', balance: 4800 },
    { name: 'Jul', balance: 5100 },
    { name: 'Aug', balance: 5400 },
    { name: 'Sep', balance: 5300 },
    { name: 'Oct', balance: 5700 },
    { name: 'Nov', balance: 6000 },
    { name: 'Dec', balance: 6400 },
];
