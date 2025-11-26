# Woods International Report Dashboard - Deployment Guide

## 🌐 Production URLs
- **Frontend**: https://report.akstrends.in
- **Backend**: https://adm.akstrends.in

## 📦 Frontend Deployment

### Build the Frontend
```bash
cd frontend
npm install
npm run build
```

### Deploy to Server
1. Upload the `frontend/dist` folder contents to your web server
2. Configure your web server (Nginx/Apache) to serve the static files
3. Ensure the server redirects all routes to `index.html` for React Router

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name report.akstrends.in;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔧 Backend Deployment

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
Ensure `backend/.env` has the correct values:
```env
WOODS_INTERNATIONAL_SERVER=103.127.31.218
WOODS_INTERNATIONAL_PORT=1433
WOODS_INTERNATIONAL_USER=woodsoft
WOODS_INTERNATIONAL_PASSWORD="Woods#3434"
WOODS_INTERNATIONAL_DATABASE=ud_woodsoft
CORS_ORIGINS=http://localhost:5173,https://report.akstrends.in
PORT=4000
```

### Start the Backend

#### Option 1: Using Node directly
```bash
cd backend
node src/index.js
```

#### Option 2: Using PM2 (Recommended for production)
```bash
# Install PM2 globally
npm install -g pm2

# Start the backend
cd backend
pm2 start src/index.js --name "woods-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### PM2 Useful Commands
```bash
# View logs
pm2 logs woods-backend

# Restart
pm2 restart woods-backend

# Stop
pm2 stop woods-backend

# Monitor
pm2 monit
```

### Nginx Reverse Proxy for Backend
```nginx
server {
    listen 80;
    server_name adm.akstrends.in;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 SSL/HTTPS Setup (Recommended)

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d report.akstrends.in
sudo certbot --nginx -d adm.akstrends.in

# Auto-renewal is set up automatically
# Test renewal with:
sudo certbot renew --dry-run
```

## ✅ Post-Deployment Checklist

### Frontend
- [ ] Build completed without errors
- [ ] Static files deployed to web server
- [ ] Website accessible at https://report.akstrends.in
- [ ] All routes work (no 404 errors)
- [ ] Login page loads correctly
- [ ] Theme toggle works
- [ ] Mobile responsive design works

### Backend
- [ ] Backend running on port 4000
- [ ] Accessible at https://adm.akstrends.in
- [ ] Database connection successful
- [ ] CORS configured correctly
- [ ] API endpoints responding:
  - [ ] GET /health
  - [ ] GET /api/store
  - [ ] POST /api/exec
  - [ ] GET /api/clients
- [ ] PM2 process running (if using PM2)

### Reports Testing
- [ ] Container Loading Report works
- [ ] Container Month Wise Report works
- [ ] Container Client Wise Report works
- [ ] Year dropdown populates correctly
- [ ] Client dropdown populates correctly
- [ ] Charts render properly
- [ ] Tables display data correctly
- [ ] Month ordering is correct (Jan-Dec)
- [ ] Date sorting works in tables
- [ ] Export to Excel works

### UI/UX
- [ ] "Back to Reports" button is centered
- [ ] Sidebar toggle button doesn't overlap
- [ ] All charts show all month labels on mobile
- [ ] Colors and gradients display correctly
- [ ] Loading states work
- [ ] Error messages display properly

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: White screen or blank page
- Check browser console for errors
- Verify all static files are uploaded
- Check Nginx/Apache configuration
- Ensure base URL is set correctly

**Problem**: API calls failing
- Check browser Network tab
- Verify backend URL in `.env.production`
- Check CORS configuration on backend
- Verify backend is running

### Backend Issues

**Problem**: Cannot connect to database
- Verify database credentials in `.env`
- Check if SQL Server is accessible from backend server
- Test connection using `backend/test-connection.js`
- Check firewall rules

**Problem**: CORS errors
- Verify `CORS_ORIGINS` in backend `.env`
- Check if frontend URL is included
- Restart backend after changing CORS settings

**Problem**: Backend not starting
- Check if port 4000 is already in use
- Verify all dependencies are installed
- Check Node.js version (should be 14+)
- Review error logs

## 📊 Monitoring

### Check Backend Health
```bash
curl https://adm.akstrends.in/health
```

Expected response:
```json
{"ok":true,"uptime":12345.67}
```

### Check Database Connection
```bash
curl https://adm.akstrends.in/api/store
```

Expected response:
```json
{
  "store": "Woods International",
  "database": "ud_woodsoft",
  "status": "connected"
}
```

### PM2 Monitoring
```bash
# View process status
pm2 status

# View logs
pm2 logs woods-backend --lines 100

# Monitor resources
pm2 monit
```

## 🔄 Updates and Maintenance

### Updating Frontend
```bash
cd frontend
git pull
npm install
npm run build
# Upload new dist folder to server
```

### Updating Backend
```bash
cd backend
git pull
npm install
pm2 restart woods-backend
```

### Database Backups
Ensure regular backups of the SQL Server database:
```sql
BACKUP DATABASE ud_woodsoft 
TO DISK = 'C:\Backups\ud_woodsoft_backup.bak'
WITH FORMAT, COMPRESSION;
```

## 📞 Support

For issues or questions:
- Check logs: `pm2 logs woods-backend`
- Review browser console for frontend errors
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify database connectivity

## 🎉 Success!

If all checklist items are complete, your Woods International Report Dashboard is successfully deployed and ready to use!
