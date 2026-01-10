# Quick Start Guide

## Prerequisites
- Node.js v18 or v20 installed
- MSSQL database (Amazon RDS or local)
- Database connection details

## Initial Setup (5 minutes)

### 1. Configure Database Connection

Edit `.env` file:
```env
DB_SERVER=your-endpoint.amazonaws.com
DB_USER=your-username
DB_PASSWORD=your-password
```

### 2. Setup Database

Run the SQL schema on your MSSQL database:
```bash
# Open SQL Server Management Studio or Azure Data Studio
# Connect to your database
# Execute: database/schema.sql
```

### 3. Create Admin User

```bash
npm run create-admin
```

This creates:
- Email: `admin@company.com`
- Password: `admin123`

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Login

Open browser: `http://localhost:5173`
- Email: admin@company.com
- Password: admin123

## Essential Commands

```bash
# Development
npm run dev              # Start frontend
npm run server:dev       # Start backend

# Production
npm run build           # Build frontend
npm run server          # Run backend

# Utilities
npm run create-admin    # Create admin user
npm run typecheck       # Check TypeScript
```

## Project Structure

```
├── server/              # Backend API
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & validation
│   └── routes/         # API endpoints
├── src/                # Frontend
│   ├── components/     # React components
│   ├── contexts/       # React context
│   ├── lib/           # Utilities
│   └── pages/         # Page components
├── database/          # SQL schema
└── .env              # Configuration
```

## API Endpoints

```
POST   /api/auth/login           # Login
GET    /api/auth/profile         # Get user profile
GET    /api/employees            # List employees
POST   /api/employees            # Create employee
GET    /api/employees/:id        # Get employee
PUT    /api/employees/:id        # Update employee
DELETE /api/employees/:id        # Delete employee
```

## Default User Roles

- `hr_admin` - Full access, can manage everything
- `manager` - Manage employees, view reports
- `supervisor` - Manage team, approve leaves
- `employee` - View own data, request leave

## Next Steps

1. Change default admin password
2. Add employees via Employees page
3. Configure Albanian tax rates in Settings
4. Set up bonus rules
5. Create additional user accounts

## Need Help?

- Check `SETUP_GUIDE.md` for detailed instructions
- Check `README.md` for feature documentation
- Review server logs: `pm2 logs hr-api` (if using PM2)

## Important Security Notes

- Change admin password immediately after first login
- Use strong passwords for all accounts
- Keep JWT_SECRET secure and random
- Enable HTTPS in production
- Regular database backups

## Albanian Tax Configuration

Default rates (update in Settings):
- Health Insurance: 1.7%
- Social Insurance: 9.5%
- PIT: 0% (up to 40k ALL), 13% (40k-200k ALL), 23% (>200k ALL)

## Troubleshooting

**Backend won't start?**
- Check database connection in `.env`
- Verify MSSQL is accessible
- Check logs for errors

**Can't login?**
- Run `npm run create-admin` again
- Verify database has Users table
- Check JWT_SECRET is set

**Frontend shows errors?**
- Verify backend is running on port 3000
- Check VITE_API_URL in `.env`
- Clear browser cache

---

For detailed setup instructions, see `SETUP_GUIDE.md`
