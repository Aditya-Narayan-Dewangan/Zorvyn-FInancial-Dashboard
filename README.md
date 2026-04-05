# Finance Dashboard UI

A clean, interactive, and aesthetically pleasing finance dashboard built with React and Vanilla CSS. This project demonstrates modern frontend development practices, including state management, data visualization, and role-based UI simulation.

## Features
- **Dashboard Overview**: Summary cards for Balance, Income, and Expenses with trend indicators.
- **Data Visualization**: 
  - Responsive Area Chart for balance trends.
  - Donut Chart for spending category distribution.
- **Transaction Management**: 
  - Comprehensive list with search, category filtering, and sorting.
  - **Admin Mode**: Add, edit, and delete transactions.
  - **Viewer Mode**: Read-only access to all data.
- **Insights Engine**: Dynamic insights like "Highest Spending Category" derived from live data.
- **Premium Design**: Dark-themed UI with glassmorphism, smooth transitions, and vibrant gradients.
- **State Management**: Built using React Context API for predictable data flow.

## Tech Stack
- **Framework**: React 18 (Vite)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: Vanilla CSS (Modern CSS variables & Grid/Flexbox)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository or extract the files.
2. Navigate to the project directory:
   ```bash
   cd z-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production
To create a production-ready bundle:
```bash
npm run build
```

## Role-Based UI
You can switch between **Admin** and **Viewer** roles using the dropdown in the top navbar.
- **Admin**: Can create, edit, and delete transactions.
- **Viewer**: Restricted to viewing charts and the transaction list only.
