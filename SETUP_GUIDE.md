# Complete Setup Guide - HR Management System

## Step-by-Step Setup Instructions

### Step 1: Prepare Your MSSQL Database

1. **Access your Amazon RDS MSSQL instance**
   - Note your endpoint URL (e.g., `your-db.abc123.us-east-1.rds.amazonaws.com`)
   - Note your master username and password
   - Ensure your security group allows connections from your local network

2. **Create the database**
   ```sql
   CREATE DATABASE HRMS;
   GO
   ```

3. **Run the schema script**
   - Open SQL Server Management Studio (SSMS) or Azure Data Studio
   - Connect to your RDS instance
   - Open the file `database/schema.sql` from this project
   - Execute the entire script
   - This creates all tables, relationships, and seed data

4. **Create the default admin user**
   ```sql
   USE HRMS;
   GO

   -- Insert admin employee
   INSERT INTO Employees (first_name, last_name, email, position, department, hire_date, status)
   VALUES ('Admin', 'User', 'admin@company.com', 'HR Administrator', 'Human Resources', GETDATE(), 'active');

   -- Insert admin user account
   -- Password: admin123
   DECLARE @employeeId INT = (SELECT employee_id FROM Employees WHERE email = 'admin@company.com');

   INSERT INTO Users (employee_id, email, password_hash, role, is_active)
   VALUES (
     @employeeId,
     'admin@company.com',
     '$2b$10$YourActualBcryptHashHere',
     'hr_admin',
     1
   );
   ```

   **Note**: You'll need to generate a proper bcrypt hash. After the first server start, you can use the API to create users properly, or run this Node.js script:

   ```javascript
   const bcrypt = require('bcrypt');
   bcrypt.hash('admin123', 10, (err, hash) => {
     console.log(hash);
   });
   ```

### Step 2: Configure the Application

1. **Navigate to the project directory**
   ```bash
   cd /path/to/hr-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Open the `.env` file in the project root
   - Update the following values:

   ```env
   # Your Amazon RDS MSSQL endpoint
   DB_SERVER=your-endpoint.rds.amazonaws.com
   DB_PORT=1433
   DB_DATABASE=HRMS
   DB_USER=your_master_username
   DB_PASSWORD=your_master_password
   DB_ENCRYPT=true

   # Generate a secure JWT secret (use a random string generator)
   JWT_SECRET=your_very_secure_random_secret_key_min_32_chars
   JWT_EXPIRES_IN=8h

   # Backend API port
   PORT=3000

   # Frontend API URL (update with your server IP for production)
   VITE_API_URL=http://localhost:3000/api
   ```

### Step 3: Running in Development Mode

This is useful for testing and development:

1. **Start the backend server** (Terminal 1)
   ```bash
   npm run server:dev
   ```

   You should see:
   ```
   ✓ Connected to MSSQL Database
   Server running on http://localhost:3000
   API available at http://localhost:3000/api
   ```

2. **Start the frontend** (Terminal 2)
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.4.8  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Access the application**
   - Open your browser to `http://localhost:5173`
   - Login with: `admin@company.com` / `admin123`

### Step 4: Deploying to Your Local Network

#### Option A: Windows Server Deployment

1. **Prepare the Server**
   - Install Node.js (v18 or v20 LTS) from nodejs.org
   - Install Git for Windows
   - Clone or copy the project to the server

2. **Configure for Production**
   - Update `.env` file:
     ```env
     VITE_API_URL=http://YOUR_SERVER_IP:3000/api
     ```
   - Replace `YOUR_SERVER_IP` with the actual IP address of your server

3. **Build the Frontend**
   ```bash
   npm run build
   ```

4. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

5. **Start the Backend with PM2**
   ```bash
   pm2 start server/index.js --name hr-api
   pm2 save
   pm2 startup
   ```

6. **Serve the Frontend**

   **Option 6a: Using IIS (Windows)**
   - Install IIS with URL Rewrite module
   - Create a new website
   - Point the physical path to the `dist` folder
   - Configure URL rewrite for SPA routing

   **Option 6b: Using nginx**
   - Install nginx for Windows
   - Configure nginx to serve the `dist` folder
   - Add proxy pass for API requests

   **Option 6c: Using serve package**
   ```bash
   npm install -g serve
   pm2 start "serve -s dist -l 80" --name hr-frontend
   pm2 save
   ```

7. **Access from Other Computers**
   - On any computer in your network, open browser to:
   - `http://YOUR_SERVER_IP` (or `http://YOUR_SERVER_IP:5000` if using serve)

#### Option B: Linux Server Deployment

1. **Prepare the Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install nginx
   sudo apt install -y nginx
   ```

2. **Deploy the Application**
   ```bash
   # Clone or copy the project
   cd /var/www
   sudo git clone <your-repo> hr-system
   cd hr-system

   # Install dependencies
   sudo npm install

   # Configure environment
   sudo nano .env
   # Update VITE_API_URL to http://YOUR_SERVER_IP/api

   # Build frontend
   sudo npm run build
   ```

3. **Setup PM2**
   ```bash
   sudo npm install -g pm2
   sudo pm2 start server/index.js --name hr-api
   sudo pm2 save
   sudo pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/hr-system
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name YOUR_SERVER_IP;

       # Frontend
       root /var/www/hr-system/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # API Proxy
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/hr-system /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Configure Firewall**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

### Step 5: Post-Deployment Configuration

1. **Create Additional Users**
   - Login as admin
   - Navigate to Employees
   - Add new employees
   - Check "Create User Account" when adding
   - Assign appropriate roles

2. **Configure Albanian Tax Rates**
   - Go to Settings > Tax Configuration
   - Review and update tax rates as needed
   - Set effective dates for any changes

3. **Setup Departments and Teams**
   - Employees will be organized by departments
   - Departments are automatically populated from employee records

4. **Configure Bonus Rules**
   - Go to Bonus Management
   - Create bonus rules for different employee types
   - Set targets and achievement metrics

### Step 6: Backup Strategy

1. **Database Backups**
   ```sql
   -- Setup automated backups in RDS Console
   -- Or manual backup:
   BACKUP DATABASE HRMS
   TO DISK = 'C:\Backups\HRMS_backup.bak'
   WITH FORMAT;
   ```

2. **Application Backups**
   - Regularly backup the `.env` file (securely!)
   - Backup any uploaded documents
   - Keep a copy of the application code

### Troubleshooting

#### Backend won't start
- Check database connection in `.env`
- Verify MSSQL server is accessible
- Check firewall rules
- View logs: `pm2 logs hr-api`

#### Frontend shows connection errors
- Verify `VITE_API_URL` is correct
- Check backend is running
- Test API manually: `curl http://YOUR_SERVER:3000/api/health`

#### Login fails
- Verify user exists in database
- Check password hash was created correctly
- Check JWT_SECRET is set in `.env`

#### Database connection timeout
- Check RDS security group allows your IP
- Verify credentials are correct
- Check if RDS instance is running

### Security Recommendations

1. **Change default admin password immediately**
2. **Use strong JWT_SECRET** (minimum 32 random characters)
3. **Enable HTTPS** in production (use Let's Encrypt)
4. **Configure RDS security group** to only allow specific IPs
5. **Regular database backups**
6. **Keep Node.js and dependencies updated**
7. **Use environment variables** for all sensitive data
8. **Implement rate limiting** on the API (install `express-rate-limit`)

### Maintenance

#### Updating the Application
```bash
# Backup first!
git pull origin main
npm install
npm run build
pm2 restart hr-api
```

#### Monitoring
```bash
# Check backend logs
pm2 logs hr-api

# Check backend status
pm2 status

# Monitor resource usage
pm2 monit
```

#### Database Maintenance
```sql
-- Rebuild indexes monthly
USE HRMS;
EXEC sp_MSforeachtable 'ALTER INDEX ALL ON ? REBUILD';

-- Update statistics
EXEC sp_updatestats;
```

## Support & Documentation

- For technical issues, check the logs first
- Refer to README.md for feature documentation
- Keep this guide for future reference
- Document any customizations you make

---

**Last Updated**: 2026-01-10
**Version**: 1.0.0
