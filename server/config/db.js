import dotenv from 'dotenv';
import {
  mockUsers,
  mockEmployees,
  mockAttendance,
  mockLeaveTypes,
  mockLeaveRequests,
  mockTaxConfig,
  mockBonusRuleTypes,
  mockPayroll,
  mockBonusRules,
  mockPerformanceReviews,
  mockDocuments
} from './mockData.js';

dotenv.config();

class MockRequest {
  constructor() {
    this.inputs = {};
  }

  input(name, type, value) {
    this.inputs[name] = value;
    return this;
  }

  async query(sql) {
    const upperSQL = sql.toUpperCase();

    if (upperSQL.includes('FROM USERS') || upperSQL.includes('FROM [USERS]')) {
      if (upperSQL.includes('WHERE EMAIL')) {
        const email = this.inputs.email;
        const user = mockUsers.find(u => u.email === email);
        return { recordset: user ? [user] : [] };
      }
      if (upperSQL.includes('WHERE USER_ID')) {
        const userId = this.inputs.userId;
        const user = mockUsers.find(u => u.user_id === userId);
        return { recordset: user ? [user] : [] };
      }
      return { recordset: mockUsers };
    }

    if (upperSQL.includes('FROM EMPLOYEES') || upperSQL.includes('FROM [EMPLOYEES]')) {
      if (upperSQL.includes('LEFT JOIN') && upperSQL.includes('WHERE U.USER_ID')) {
        const userId = this.inputs.userId;
        const user = mockUsers.find(u => u.user_id === userId);
        if (user && user.employee_id) {
          const employee = mockEmployees.find(e => e.employee_id === user.employee_id);
          if (employee) {
            return {
              recordset: [{
                ...user,
                ...employee
              }]
            };
          }
        }
        return { recordset: [] };
      }
      if (upperSQL.includes('WHERE EMPLOYEE_ID')) {
        const employeeId = this.inputs.employeeId;
        const employee = mockEmployees.find(e => e.employee_id === employeeId);
        return { recordset: employee ? [employee] : [] };
      }
      return { recordset: mockEmployees };
    }

    if (upperSQL.includes('FROM ATTENDANCE') || upperSQL.includes('FROM [ATTENDANCE]')) {
      if (upperSQL.includes('WHERE EMPLOYEE_ID')) {
        const employeeId = this.inputs.employeeId;
        const records = mockAttendance.filter(a => a.employee_id === employeeId);
        return { recordset: records };
      }
      return { recordset: mockAttendance };
    }

    if (upperSQL.includes('FROM LEAVE_TYPES') || upperSQL.includes('FROM [LEAVE_TYPES]') || upperSQL.includes('FROM LEAVETYPES')) {
      return { recordset: mockLeaveTypes };
    }

    if (upperSQL.includes('FROM LEAVE_REQUESTS') || upperSQL.includes('FROM [LEAVE_REQUESTS]') || upperSQL.includes('FROM LEAVEREQUESTS')) {
      if (upperSQL.includes('WHERE EMPLOYEE_ID')) {
        const employeeId = this.inputs.employeeId;
        const records = mockLeaveRequests.filter(lr => lr.employee_id === employeeId);
        return { recordset: records };
      }
      if (upperSQL.includes('WHERE STATUS')) {
        const status = this.inputs.status;
        const records = mockLeaveRequests.filter(lr => lr.status === status);
        return { recordset: records };
      }
      return { recordset: mockLeaveRequests };
    }

    if (upperSQL.includes('FROM TAX_CONFIGURATION') || upperSQL.includes('FROM [TAX_CONFIGURATION]') || upperSQL.includes('FROM TAXCONFIGURATION')) {
      if (upperSQL.includes('WHERE IS_ACTIVE')) {
        const records = mockTaxConfig.filter(tc => tc.is_active === 1);
        return { recordset: records };
      }
      return { recordset: mockTaxConfig };
    }

    if (upperSQL.includes('FROM BONUS_RULE_TYPES') || upperSQL.includes('FROM [BONUS_RULE_TYPES]') || upperSQL.includes('FROM BONUSRULETYPES')) {
      return { recordset: mockBonusRuleTypes };
    }

    if (upperSQL.includes('FROM PAYROLL') || upperSQL.includes('FROM [PAYROLL]')) {
      return { recordset: mockPayroll };
    }

    if (upperSQL.includes('FROM BONUS_RULES') || upperSQL.includes('FROM [BONUS_RULES]') || upperSQL.includes('FROM BONUSRULES')) {
      return { recordset: mockBonusRules };
    }

    if (upperSQL.includes('FROM PERFORMANCE_REVIEWS') || upperSQL.includes('FROM [PERFORMANCE_REVIEWS]') || upperSQL.includes('FROM PERFORMANCEREVIEWS')) {
      return { recordset: mockPerformanceReviews };
    }

    if (upperSQL.includes('FROM DOCUMENTS') || upperSQL.includes('FROM [DOCUMENTS]')) {
      return { recordset: mockDocuments };
    }

    if (upperSQL.includes('UPDATE USERS')) {
      const userId = this.inputs.userId;
      const user = mockUsers.find(u => u.user_id === userId);
      if (user && this.inputs.passwordHash) {
        user.password_hash = this.inputs.passwordHash;
        user.updated_at = new Date();
      }
      return { recordset: [], rowsAffected: [1] };
    }

    if (upperSQL.includes('INSERT INTO')) {
      return { recordset: [{ id: Math.floor(Math.random() * 10000) }], rowsAffected: [1] };
    }

    if (upperSQL.includes('DELETE FROM')) {
      return { recordset: [], rowsAffected: [1] };
    }

    return { recordset: [] };
  }
}

class MockPool {
  request() {
    return new MockRequest();
  }

  async close() {
    return Promise.resolve();
  }
}

let pool;

export const connectDB = async () => {
  try {
    pool = new MockPool();
    console.log('✓ Connected to Mock Database (MSSQL structure)');
    console.log('✓ Using hardcoded data - admin@company.com / admin123');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return pool;
};

export const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing database:', err);
  }
};

export const sql = {
  VarChar: 'VarChar',
  Int: 'Int',
  Bit: 'Bit',
  Date: 'Date',
  DateTime: 'DateTime',
  Decimal: 'Decimal',
  Float: 'Float'
};
