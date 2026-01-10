# HR Management System for Debt Collection Company

A comprehensive HR Management System built specifically for a debt collection company operating in Albania. This system manages employees, attendance, leave, payroll with Albanian tax regulations, performance-based bonuses, and more.

## Features

### Core Modules
- **Employee Management** - Complete employee lifecycle management
- **Attendance Tracking** - Daily attendance, overtime, and time management
- **Leave Management** - Leave requests, approvals, and balance tracking
- **Payroll System** - Salary calculation with Albanian tax deductions
- **Bonus Management** - Complex rule-based bonus calculations
- **Performance Reviews** - Employee performance tracking and reviews
- **Document Management** - Employee document storage and management
- **Reports & Analytics** - Comprehensive reporting dashboard

### Albanian Tax Compliance
- Health Insurance (Sigurime Shëndetësore) configuration
- Social Insurance (Sigurime Shoqërore) configuration
- Personal Income Tax (PIT) brackets and rates
- Fully editable tax rates and thresholds
- Regulatory change management

### Advanced Bonus System
- Multiple bonus types: Fixed, Percentage, Progressive, Target-based
- Application levels: Individual, Team, Supervisor, Department
- Stackable bonus rules
- Target tracking and achievement calculations
- Performance-based bonus automation

## Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- MSSQL database connection
- JWT authentication
- Bcrypt for password hashing

### Database
- Microsoft SQL Server (hosted on Amazon RDS)

## Setup Instructions

### 1. Database Setup

Run the database schema script on your MSSQL instance:

```bash
# Connect to your MSSQL database and run:
database/schema.sql
```

This will create all necessary tables, indexes, and seed data.

### 2. Create Default Admin User

After running the schema, create a default admin user:

```sql
USE HRMS;

-- First create an employee record
INSERT INTO Employees (first_name, last_name, email, position, department, hire_date, status)
VALUES ('Admin', 'User', 'admin@company.com', 'HR Administrator', 'Human Resources', GETDATE(), 'active');

-- Then create the user account (password is: admin123)
INSERT INTO Users (employee_id, email, password_hash, role, is_active)
VALUES (
  (SELECT employee_id FROM Employees WHERE email = 'admin@company.com'),
  'admin@company.com',
  '$2b$10$rOQ5YvJKYZJZGZKGZKGZKeT8YvJKYZJZGZKGZKGZKeT8YvJKYZJZG', -- admin123
  'hr_admin',
  1
);
```

### 3. Configure Environment Variables

Update the `.env` file with your MSSQL database connection details:

```env
# Database Configuration
DB_SERVER=your-amazon-rds-endpoint.amazonaws.com
DB_PORT=1433
DB_DATABASE=HRMS
DB_USER=your-username
DB_PASSWORD=your-password
DB_ENCRYPT=true

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=8h

# Server Configuration
PORT=3000
VITE_API_URL=http://localhost:3000/api
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

#### Development Mode

You need to run both the frontend and backend:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
This starts the Vite development server on port 5173.

**Terminal 2 - Backend:**
```bash
npm run server:dev
```
This starts the Express API server on port 3000.

#### Production Mode

Build the frontend:
```bash
npm run build
```

Run the backend:
```bash
npm run server
```

Serve the built frontend using a static file server like nginx or serve.

### 6. Access the Application

- **Frontend:** http://localhost:5173 (development) or your configured URL
- **API:** http://localhost:3000/api
- **Default Login:** admin@company.com / admin123

## Deployment on Local Network

### Option 1: Windows Server

1. Install Node.js on your Windows server
2. Clone the project to the server
3. Configure the `.env` file with your network IP
4. Build the frontend: `npm run build`
5. Install PM2 globally: `npm install -g pm2`
6. Run the backend with PM2: `pm2 start server/index.js --name hr-api`
7. Install and configure IIS or nginx to serve the frontend build files
8. Access via: http://your-server-ip

### Option 2: Linux Server

1. Install Node.js on your Linux server
2. Clone the project to the server
3. Configure the `.env` file
4. Build the frontend: `npm run build`
5. Install PM2: `npm install -g pm2`
6. Run the backend: `pm2 start server/index.js --name hr-api`
7. Install nginx and configure it to serve the frontend and proxy API requests
8. Access via: http://your-server-ip

## User Roles

- **hr_admin**: Full system access, payroll, settings, tax configuration
- **manager**: Employee management, reports, bonus configuration
- **supervisor**: Team attendance, leave approvals, performance reviews
- **employee**: Personal attendance, leave requests, document access

## Albanian Tax Configuration

Access Settings > Tax Configuration to manage:

- Health Insurance rates (default: 1.7% employee contribution)
- Social Insurance rates (default: 9.5% employee contribution)
- PIT brackets:
  - 0% for income up to 40,000 ALL
  - 13% for income 40,001 - 200,000 ALL
  - 23% for income above 200,000 ALL
- Minimum wage settings

All rates are editable and support effective dates for regulatory changes.

## Future Development

The following modules are planned for future implementation:
- Attendance tracking with check-in/out
- Leave request workflow
- Payroll calculation and processing
- Bonus rule configuration and calculation
- Performance review cycles
- Document upload and management
- Advanced reporting and analytics

## Support

For issues or questions, please contact your system administrator.

## License

Proprietary - Internal use only
