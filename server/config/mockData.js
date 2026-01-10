import bcrypt from 'bcrypt';

const passwordHash = '$2b$10$RXcubCqXivHz21qFliN3zeBzu1AcpKMrO7YfSJj27D8aGQENbu.Pi';

export const mockUsers = [
  {
    user_id: 1,
    employee_id: 1,
    email: 'admin@company.com',
    password_hash: passwordHash,
    role: 'hr_admin',
    is_active: 1,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
];

export const mockEmployees = [
  {
    employee_id: 1,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@company.com',
    phone: '+355 69 123 4567',
    position: 'HR Administrator',
    department: 'Human Resources',
    team: 'HR Team',
    supervisor_id: null,
    date_of_birth: new Date('1985-01-15'),
    hire_date: new Date('2024-01-01'),
    address: '123 Main Street',
    city: 'Tirana',
    personal_id_number: 'J12345678K',
    bank_account: 'AL35202111090000000001234567',
    salary_base: 80000.00,
    status: 'active',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    employee_id: 2,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.com',
    phone: '+355 69 234 5678',
    position: 'Software Engineer',
    department: 'IT',
    team: 'Development',
    supervisor_id: 1,
    date_of_birth: new Date('1990-03-20'),
    hire_date: new Date('2023-06-01'),
    address: '456 Tech Street',
    city: 'Tirana',
    personal_id_number: 'J23456789K',
    bank_account: 'AL35202111090000000001234568',
    salary_base: 65000.00,
    status: 'active',
    created_at: new Date('2023-06-01'),
    updated_at: new Date('2023-06-01')
  },
  {
    employee_id: 3,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+355 69 345 6789',
    position: 'Marketing Manager',
    department: 'Marketing',
    team: 'Marketing',
    supervisor_id: 1,
    date_of_birth: new Date('1988-07-12'),
    hire_date: new Date('2023-03-15'),
    address: '789 Market Ave',
    city: 'Tirana',
    personal_id_number: 'J34567890K',
    bank_account: 'AL35202111090000000001234569',
    salary_base: 70000.00,
    status: 'active',
    created_at: new Date('2023-03-15'),
    updated_at: new Date('2023-03-15')
  }
];

export const mockAttendance = [
  {
    attendance_id: 1,
    employee_id: 2,
    date: new Date('2024-01-10'),
    check_in_time: '09:00:00',
    check_out_time: '17:30:00',
    total_hours: 8.5,
    overtime_hours: 0.5,
    status: 'present',
    notes: null,
    approved_by: 1,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10')
  }
];

export const mockLeaveTypes = [
  { leave_type_id: 1, name: 'Annual Leave', days_per_year: 20, is_paid: 1, requires_approval: 1 },
  { leave_type_id: 2, name: 'Sick Leave', days_per_year: 14, is_paid: 1, requires_approval: 1 },
  { leave_type_id: 3, name: 'Personal Leave', days_per_year: 5, is_paid: 0, requires_approval: 1 },
  { leave_type_id: 4, name: 'Maternity Leave', days_per_year: 365, is_paid: 1, requires_approval: 1 },
  { leave_type_id: 5, name: 'Paternity Leave', days_per_year: 10, is_paid: 1, requires_approval: 1 }
];

export const mockLeaveRequests = [
  {
    leave_request_id: 1,
    employee_id: 2,
    leave_type_id: 1,
    start_date: new Date('2024-02-01'),
    end_date: new Date('2024-02-05'),
    days_count: 5,
    reason: 'Family vacation',
    status: 'pending',
    requested_date: new Date('2024-01-10'),
    reviewed_by: null,
    reviewed_date: null,
    reviewer_notes: null
  }
];

export const mockTaxConfig = [
  {
    tax_config_id: 1,
    config_name: 'Health Insurance Employee',
    config_type: 'health_insurance',
    rate_percentage: 1.7,
    fixed_amount: null,
    threshold_min: 0,
    threshold_max: null,
    effective_date: new Date('2024-01-01'),
    end_date: null,
    is_active: 1,
    notes: 'Employee contribution to health insurance'
  },
  {
    tax_config_id: 2,
    config_name: 'Social Insurance Employee',
    config_type: 'social_insurance',
    rate_percentage: 9.5,
    fixed_amount: null,
    threshold_min: 0,
    threshold_max: null,
    effective_date: new Date('2024-01-01'),
    end_date: null,
    is_active: 1,
    notes: 'Employee contribution to social insurance'
  },
  {
    tax_config_id: 3,
    config_name: 'PIT Bracket 1',
    config_type: 'personal_income_tax',
    rate_percentage: 0,
    fixed_amount: null,
    threshold_min: 0,
    threshold_max: 40000,
    effective_date: new Date('2024-01-01'),
    end_date: null,
    is_active: 1,
    notes: 'No tax up to 40,000 ALL'
  },
  {
    tax_config_id: 4,
    config_name: 'PIT Bracket 2',
    config_type: 'personal_income_tax',
    rate_percentage: 13,
    fixed_amount: null,
    threshold_min: 40001,
    threshold_max: 200000,
    effective_date: new Date('2024-01-01'),
    end_date: null,
    is_active: 1,
    notes: '13% tax for 40,001 - 200,000 ALL'
  },
  {
    tax_config_id: 5,
    config_name: 'PIT Bracket 3',
    config_type: 'personal_income_tax',
    rate_percentage: 23,
    fixed_amount: null,
    threshold_min: 200001,
    threshold_max: null,
    effective_date: new Date('2024-01-01'),
    end_date: null,
    is_active: 1,
    notes: '23% tax above 200,000 ALL'
  }
];

export const mockBonusRuleTypes = [
  { rule_type_id: 1, name: 'Performance Bonus', description: 'Based on individual performance targets', calculation_type: 'target_based' },
  { rule_type_id: 2, name: 'Team Bonus', description: 'Based on team achievement', calculation_type: 'target_based' },
  { rule_type_id: 3, name: 'Fixed Monthly Bonus', description: 'Fixed amount paid monthly', calculation_type: 'fixed' }
];

export const mockPayroll = [];
export const mockBonusRules = [];
export const mockPerformanceReviews = [];
export const mockDocuments = [];
