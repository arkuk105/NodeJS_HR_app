# Mock Data Setup

This application is currently configured to use **mock data** instead of a real database connection.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Login

Open your browser to `http://localhost:5173` and login with:
- **Email:** admin@company.com
- **Password:** admin123

## About the Mock Database

The backend uses a mock database that:
- Maintains the MSSQL structure and query syntax
- Returns hardcoded sample data
- Simulates database operations without requiring a real database
- Perfect for development and testing

### Mock Data Includes:

**Users:**
- 1 Admin user (admin@company.com / admin123)

**Employees:**
- Admin User - HR Administrator
- John Doe - Software Engineer
- Jane Smith - Marketing Manager

**System Data:**
- 5 Leave types (Annual, Sick, Personal, Maternity, Paternity)
- 5 Albanian tax configurations (Health Insurance, Social Insurance, PIT brackets)
- 3 Bonus rule types
- Sample attendance records

## Modifying Mock Data

All mock data is located in: `server/config/mockData.js`

You can:
- Add more employees
- Modify tax rates
- Add sample payroll records
- Customize leave types

## Switching to Real Database

To use an actual MSSQL database:

1. **Update `.env` with database credentials:**
```env
DB_SERVER=your-server.database.windows.net
DB_USER=your-username
DB_PASSWORD=your-password
DB_DATABASE=HRMS
```

2. **Replace mock implementation:**
   - Update `server/config/db.js` to use real MSSQL connection
   - Remove mock data imports

3. **Run database schema:**
   - Execute `database/schema.sql` on your MSSQL server

4. **Create admin user:**
```bash
npm run create-admin
```

## Benefits of Mock Data

- **No database setup required** - Start developing immediately
- **Fast development** - No network latency or connection issues
- **Easy testing** - Predictable data for testing features
- **Portable** - Works on any machine without external dependencies
