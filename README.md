# Woods International Report Panel

Comprehensive reporting and analytics dashboard for Woods International Gabon operations.

![Woods International](frontend/public/wood_logo.png)

## 🚀 Project Overview

This is a full-stack web application providing real-time reporting, analytics, and data visualization for Woods International Gabon - a wood cutting and manufacturing company. The system connects to a Microsoft SQL Server database and provides interactive reports with export capabilities, featuring a warm wood-themed aesthetic with beige and brown tones.

## 📋 Features

### Reports
- **Sales Report** - Detailed sales analysis with customer and brand breakdowns
- **Purchase Report** - Purchase tracking by seller and brand
- **Current Stock Report** - Real-time inventory management
- **Payment Received Report** - Payment tracking and analysis
- **Pending Payment Report** - Outstanding payment monitoring
- **Order Report** - Order analysis by month, client, and brand
- **Petty Expense Report** - Expense tracking and summaries

### Capabilities
- 📊 Interactive charts and data visualization
- 📥 Export to Excel/CSV with chart images
- 🔐 Secure user authentication
- 🎨 Modern, responsive UI with Material Design
- 🌓 Dark/Light theme support
- 📱 Mobile-friendly interface
- 🔍 Advanced filtering (date range, brand, customer)
- ↕️ Sortable data tables

## 🏗️ Architecture

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** Microsoft SQL Server
- **API:** RESTful endpoints for stored procedures and queries
- **CORS:** Configured for secure cross-origin requests

### Frontend
- **Framework:** React 19 with Vite
- **UI Library:** Material-UI 7
- **Charts:** Recharts
- **Routing:** React Router
- **State Management:** React Context API

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- Access to Woods International SQL Server database
- Git

### Backend Setup

```bash
cd backend
npm install

# Create .env file with database credentials
cp .env.example .env
# Edit .env with your database credentials

# Test database connection
node test-connection.js

# Start backend server
npm start
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables (`backend/.env`)

```env
# Server Configuration
PORT=4000

# Woods International Database
WOODS_INTERNATIONAL_SERVER=103.127.31.218
WOODS_INTERNATIONAL_PORT=1433
WOODS_INTERNATIONAL_USER=woodsoft
WOODS_INTERNATIONAL_PASSWORD=Woods#3434
WOODS_INTERNATIONAL_DATABASE=ud_woodsoft

# CORS Origins
CORS_ORIGINS=http://localhost:5173,https://report.akstrends.in
```

### Frontend Environment Variables

**Development** (`.env.local`):
```env
VITE_API_BASE=http://localhost:4000
```

**Production** (`.env.production`):
```env
VITE_API_BASE=https://adm.akstrends.in
```

## 🌐 Deployment

### Production Domains
- **Frontend:** https://report.akstrends.in
- **Backend:** https://adm.akstrends.in

### Deployment Steps

1. **Backend Deployment**
   ```bash
   cd backend
   npm install --production
   npm start
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   npm install
   npm run build
   # Deploy the 'dist' folder to your web server
   ```

3. **SSL Configuration**
   - Ensure both domains have valid SSL certificates
   - Configure reverse proxy (nginx/Apache) if needed

4. **Database Access**
   - Verify production server can access SQL Server
   - Check firewall rules for port 1433

## 📊 Database Requirements

### Required Stored Procedures

The following stored procedures must exist in the `ud_woodsoft` database:

- `proc_CHutilizedatewise_reportf2` - Sales Report
- `proc_summary_purchase1` - Purchase Report
- `proc_CHgetstockfordisbushCurrent` - Stock Report
- `proc_paymentreceived_datewise_data` - Payment Report
- `proc_getpendingpaymentpartywise` - Pending Payment Report
- `proc_gettotalordertill` - Order Report
- `proc_pettyexpanse_report` - Petty Expense Report
- `proc_drp_sale_report` - Dropdown data (brands, customers)
- `proc_logindone` - User authentication

### Testing Database Connection

```bash
cd backend
node test-connection.js
```

This will verify:
- ✅ Database connectivity
- ✅ Stored procedure existence
- ✅ SQL Server version

## 🧪 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:4000/health

# Store info
curl http://localhost:4000/api/store

# Test stored procedure
curl -X POST http://localhost:4000/api/exec \
  -H "Content-Type: application/json" \
  -d '{"procedure":"proc_drp_sale_report","params":{}}'
```

### Frontend Testing

1. Open browser to `http://localhost:5173`
2. Login with valid credentials
3. Test each report type
4. Verify charts render correctly
5. Test export functionality

## 📁 Project Structure

```
woods-international/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── mssql/
│   │       └── pools.js       # Database connection
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── test-connection.js     # DB test script
├── frontend/
│   ├── public/
│   │   └── wood_logo.png      # Company logo
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # Context providers
│   │   ├── layout/            # Layout components
│   │   ├── pages/             # Page components
│   │   ├── shared/            # Shared utilities
│   │   └── theme/             # MUI theme
│   ├── package.json
│   └── vite.config.js
├── CONVERSION_SUMMARY.md      # Conversion details
├── DOMAIN_CONFIG.md           # Domain configuration
└── README.md                  # This file
```

## 🔐 Security

- All API requests use HTTPS in production
- CORS is strictly configured
- SQL injection protection via parameterized queries
- User authentication required for all reports
- Secure password handling

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
- Verify SQL Server is accessible
- Check firewall rules for port 1433
- Confirm credentials in `.env` file
- Run `node test-connection.js`

**CORS Errors**
- Verify `CORS_ORIGINS` in `.env`
- Check frontend domain matches allowed origins

### Frontend Issues

**API Calls Failing**
- Check `VITE_API_BASE` environment variable
- Verify backend is running
- Check browser console for errors

**Login Not Working**
- Verify `proc_logindone` stored procedure exists
- Check user credentials in database
- Review backend logs

## 📝 License

Proprietary - Woods International Gabon

## 👥 Support

For technical support or questions, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** November 24, 2025  
**Status:** ✅ Production Ready
