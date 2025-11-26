# Woods International Report Panel - Frontend

React + Vite application for Woods International Gabon reporting and analytics.

## Features

- 📊 Multiple report types (Sales, Purchase, Stock, Payment, Orders, Expenses)
- 📈 Interactive charts and data visualization
- 📥 Export to Excel/CSV with chart images
- 🔐 Secure authentication
- 🌓 Dark/Light mode
- 📱 Responsive design
- 🎨 Material-UI components

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.local` for local development:
```
VITE_API_BASE=http://localhost:4000
```

Production environment (`.env.production`):
```
VITE_API_BASE=https://adm.akstrends.in
```

## Available Reports

1. **Sales Report** - Detailed sales transactions with customer and brand analysis
2. **Purchase Report** - Purchase summary by seller and brand
3. **Current Stock Report** - Real-time inventory levels
4. **Payment Received Report** - Payment tracking by party
5. **Pending Payment Report** - Outstanding payments
6. **Order Report** - Orders by month, client, and brand
7. **Petty Expense Report** - Expense tracking and summaries

## Tech Stack

- React 19
- Vite 7
- Material-UI 7
- Recharts (data visualization)
- React Router
- Day.js (date handling)
- XLSX & FileSaver (exports)
