import bcrypt from 'bcrypt';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    const pool = await sql.connect(config);

    const email = 'admin@company.com';
    const password = 'admin123';
    const firstName = 'Admin';
    const lastName = 'User';

    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('Creating employee record...');
    const employeeResult = await pool
      .request()
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('email', sql.VarChar, email)
      .query(`
        INSERT INTO Employees (first_name, last_name, email, position, department, hire_date, status)
        OUTPUT INSERTED.employee_id
        VALUES (@firstName, @lastName, @email, 'HR Administrator', 'Human Resources', GETDATE(), 'active')
      `);

    const employeeId = employeeResult.recordset[0].employee_id;

    console.log('Creating user account...');
    await pool
      .request()
      .input('employeeId', sql.Int, employeeId)
      .input('email', sql.VarChar, email)
      .input('passwordHash', sql.VarChar, passwordHash)
      .query(`
        INSERT INTO Users (employee_id, email, password_hash, role, is_active)
        VALUES (@employeeId, @email, @passwordHash, 'hr_admin', 1)
      `);

    console.log('✓ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');
    console.log('IMPORTANT: Change this password after first login!');

    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
