import { getPool, sql } from '../config/db.js';
import bcrypt from 'bcrypt';

export const getEmployees = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    const pool = getPool();

    let query = `
      SELECT
        e.employee_id, e.first_name, e.last_name, e.email, e.phone,
        e.position, e.department, e.team, e.supervisor_id,
        e.hire_date, e.date_of_birth, e.address, e.city,
        e.personal_id_number, e.status, e.bank_account,
        e.salary_base, e.created_at, e.updated_at,
        s.first_name + ' ' + s.last_name as supervisor_name
      FROM Employees e
      LEFT JOIN Employees s ON e.supervisor_id = s.employee_id
      WHERE 1=1
    `;

    const request = pool.request();

    if (department) {
      query += ' AND e.department = @department';
      request.input('department', sql.VarChar, department);
    }

    if (status) {
      query += ' AND e.status = @status';
      request.input('status', sql.VarChar, status);
    }

    if (search) {
      query += ` AND (e.first_name LIKE @search OR e.last_name LIKE @search OR e.email LIKE @search)`;
      request.input('search', sql.VarChar, `%${search}%`);
    }

    query += ' ORDER BY e.first_name, e.last_name';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT
          e.*,
          s.first_name + ' ' + s.last_name as supervisor_name,
          u.email as user_email, u.role as user_role
        FROM Employees e
        LEFT JOIN Employees s ON e.supervisor_id = s.employee_id
        LEFT JOIN Users u ON e.employee_id = u.employee_id
        WHERE e.employee_id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      team,
      supervisorId,
      dateOfBirth,
      hireDate,
      address,
      city,
      personalIdNumber,
      bankAccount,
      salaryBase,
      createUser,
      userRole,
      userPassword,
    } = req.body;

    if (!firstName || !lastName || !email || !position || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = getPool();
    const transaction = pool.transaction();

    await transaction.begin();

    try {
      const employeeResult = await transaction
        .request()
        .input('firstName', sql.VarChar, firstName)
        .input('lastName', sql.VarChar, lastName)
        .input('email', sql.VarChar, email)
        .input('phone', sql.VarChar, phone || null)
        .input('position', sql.VarChar, position)
        .input('department', sql.VarChar, department)
        .input('team', sql.VarChar, team || null)
        .input('supervisorId', sql.Int, supervisorId || null)
        .input('dateOfBirth', sql.Date, dateOfBirth || null)
        .input('hireDate', sql.Date, hireDate || new Date())
        .input('address', sql.VarChar, address || null)
        .input('city', sql.VarChar, city || null)
        .input('personalIdNumber', sql.VarChar, personalIdNumber || null)
        .input('bankAccount', sql.VarChar, bankAccount || null)
        .input('salaryBase', sql.Decimal(10, 2), salaryBase || 0)
        .query(`
          INSERT INTO Employees (
            first_name, last_name, email, phone, position, department, team,
            supervisor_id, date_of_birth, hire_date, address, city,
            personal_id_number, bank_account, salary_base, status
          )
          OUTPUT INSERTED.employee_id
          VALUES (
            @firstName, @lastName, @email, @phone, @position, @department, @team,
            @supervisorId, @dateOfBirth, @hireDate, @address, @city,
            @personalIdNumber, @bankAccount, @salaryBase, 'active'
          )
        `);

      const employeeId = employeeResult.recordset[0].employee_id;

      if (createUser) {
        const hashedPassword = await bcrypt.hash(userPassword || 'Password123!', 10);

        await transaction
          .request()
          .input('employeeId', sql.Int, employeeId)
          .input('email', sql.VarChar, email)
          .input('passwordHash', sql.VarChar, hashedPassword)
          .input('role', sql.VarChar, userRole || 'employee')
          .query(`
            INSERT INTO Users (employee_id, email, password_hash, role, is_active)
            VALUES (@employeeId, @email, @passwordHash, @role, 1)
          `);
      }

      await transaction.commit();

      res.status(201).json({
        message: 'Employee created successfully',
        employeeId,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      team,
      supervisorId,
      dateOfBirth,
      hireDate,
      address,
      city,
      personalIdNumber,
      bankAccount,
      salaryBase,
      status,
    } = req.body;

    const pool = getPool();

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('position', sql.VarChar, position)
      .input('department', sql.VarChar, department)
      .input('team', sql.VarChar, team)
      .input('supervisorId', sql.Int, supervisorId)
      .input('dateOfBirth', sql.Date, dateOfBirth)
      .input('hireDate', sql.Date, hireDate)
      .input('address', sql.VarChar, address)
      .input('city', sql.VarChar, city)
      .input('personalIdNumber', sql.VarChar, personalIdNumber)
      .input('bankAccount', sql.VarChar, bankAccount)
      .input('salaryBase', sql.Decimal(10, 2), salaryBase)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE Employees
        SET
          first_name = @firstName,
          last_name = @lastName,
          email = @email,
          phone = @phone,
          position = @position,
          department = @department,
          team = @team,
          supervisor_id = @supervisorId,
          date_of_birth = @dateOfBirth,
          hire_date = @hireDate,
          address = @address,
          city = @city,
          personal_id_number = @personalIdNumber,
          bank_account = @bankAccount,
          salary_base = @salaryBase,
          status = @status,
          updated_at = GETDATE()
        WHERE employee_id = @id
      `);

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Employees
        SET status = 'terminated', updated_at = GETDATE()
        WHERE employee_id = @id
      `);

    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to deactivate employee' });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT DISTINCT department
      FROM Employees
      WHERE status = 'active'
      ORDER BY department
    `);

    res.json(result.recordset.map(r => r.department));
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const getTeams = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT DISTINCT team
      FROM Employees
      WHERE status = 'active' AND team IS NOT NULL
      ORDER BY team
    `);

    res.json(result.recordset.map(r => r.team));
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};
