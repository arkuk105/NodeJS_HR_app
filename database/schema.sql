-- HR Management System Database Schema
-- For MSSQL (Microsoft SQL Server)
-- Run this script on your Amazon RDS MSSQL instance

USE HRMS;
GO

-- Users Table (for authentication)
IF OBJECT_ID('Users', 'U') IS NULL
BEGIN
  CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('hr_admin', 'manager', 'supervisor', 'employee')),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
  );
END
GO

-- Employees Table
IF OBJECT_ID('Employees', 'U') IS NULL
BEGIN
  CREATE TABLE Employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    team VARCHAR(100),
    supervisor_id INT,
    date_of_birth DATE,
    hire_date DATE NOT NULL DEFAULT GETDATE(),
    address VARCHAR(255),
    city VARCHAR(100),
    personal_id_number VARCHAR(50) UNIQUE,
    bank_account VARCHAR(50),
    salary_base DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (supervisor_id) REFERENCES Employees(employee_id)
  );
END
GO

-- Attendance Table
IF OBJECT_ID('Attendance', 'U') IS NULL
BEGIN
  CREATE TABLE Attendance (
    attendance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) CHECK (status IN ('present', 'absent', 'late', 'half_day')),
    notes VARCHAR(500),
    approved_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id),
    CONSTRAINT UQ_Employee_Date UNIQUE (employee_id, date)
  );
END
GO

-- Leave Types Table
IF OBJECT_ID('LeaveTypes', 'U') IS NULL
BEGIN
  CREATE TABLE LeaveTypes (
    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    days_per_year INT DEFAULT 0,
    is_paid BIT DEFAULT 1,
    requires_approval BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
  );
END
GO

-- Leave Requests Table
IF OBJECT_ID('LeaveRequests', 'U') IS NULL
BEGIN
  CREATE TABLE LeaveRequests (
    leave_request_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INT NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    requested_date DATETIME2 DEFAULT GETDATE(),
    reviewed_by INT,
    reviewed_date DATETIME2,
    reviewer_notes VARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES LeaveTypes(leave_type_id),
    FOREIGN KEY (reviewed_by) REFERENCES Users(user_id)
  );
END
GO

-- Leave Balances Table
IF OBJECT_ID('LeaveBalances', 'U') IS NULL
BEGIN
  CREATE TABLE LeaveBalances (
    balance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    year INT NOT NULL,
    total_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    remaining_days AS (total_days - used_days) PERSISTED,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES LeaveTypes(leave_type_id),
    CONSTRAINT UQ_Employee_LeaveType_Year UNIQUE (employee_id, leave_type_id, year)
  );
END
GO

-- Tax Configuration Table (Albanian regulations)
IF OBJECT_ID('TaxConfiguration', 'U') IS NULL
BEGIN
  CREATE TABLE TaxConfiguration (
    tax_config_id INT IDENTITY(1,1) PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL UNIQUE,
    config_type VARCHAR(50) NOT NULL CHECK (config_type IN ('health_insurance', 'social_insurance', 'personal_income_tax', 'minimum_wage')),
    rate_percentage DECIMAL(5,2),
    fixed_amount DECIMAL(10,2),
    threshold_min DECIMAL(10,2),
    threshold_max DECIMAL(10,2),
    effective_date DATE NOT NULL,
    end_date DATE,
    is_active BIT DEFAULT 1,
    notes VARCHAR(500),
    created_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
  );
END
GO

-- Bonus Rule Types Table
IF OBJECT_ID('BonusRuleTypes', 'U') IS NULL
BEGIN
  CREATE TABLE BonusRuleTypes (
    rule_type_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    calculation_type VARCHAR(50) CHECK (calculation_type IN ('fixed', 'percentage', 'progressive', 'target_based')),
    created_at DATETIME2 DEFAULT GETDATE()
  );
END
GO

-- Bonus Rules Table
IF OBJECT_ID('BonusRules', 'U') IS NULL
BEGIN
  CREATE TABLE BonusRules (
    bonus_rule_id INT IDENTITY(1,1) PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    rule_type_id INT NOT NULL,
    application_level VARCHAR(50) CHECK (application_level IN ('individual', 'team', 'supervisor', 'department', 'company')),
    calculation_type VARCHAR(50) CHECK (calculation_type IN ('fixed', 'percentage', 'progressive', 'target_based')),
    base_value DECIMAL(10,2),
    percentage_value DECIMAL(5,2),
    target_metric VARCHAR(100),
    target_value DECIMAL(10,2),
    priority_order INT DEFAULT 1,
    is_stackable BIT DEFAULT 1,
    effective_start_date DATE NOT NULL,
    effective_end_date DATE,
    is_active BIT DEFAULT 1,
    created_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (rule_type_id) REFERENCES BonusRuleTypes(rule_type_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
  );
END
GO

-- Bonus Rule Tiers Table (for progressive bonuses)
IF OBJECT_ID('BonusRuleTiers', 'U') IS NULL
BEGIN
  CREATE TABLE BonusRuleTiers (
    tier_id INT IDENTITY(1,1) PRIMARY KEY,
    bonus_rule_id INT NOT NULL,
    tier_order INT NOT NULL,
    threshold_min DECIMAL(10,2) NOT NULL,
    threshold_max DECIMAL(10,2),
    bonus_amount DECIMAL(10,2),
    bonus_percentage DECIMAL(5,2),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (bonus_rule_id) REFERENCES BonusRules(bonus_rule_id) ON DELETE CASCADE
  );
END
GO

-- Employee Bonus Assignments Table
IF OBJECT_ID('EmployeeBonusAssignments', 'U') IS NULL
BEGIN
  CREATE TABLE EmployeeBonusAssignments (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    bonus_rule_id INT NOT NULL,
    assigned_date DATE DEFAULT GETDATE(),
    is_active BIT DEFAULT 1,
    created_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (bonus_rule_id) REFERENCES BonusRules(bonus_rule_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
  );
END
GO

-- Performance Targets Table
IF OBJECT_ID('PerformanceTargets', 'U') IS NULL
BEGIN
  CREATE TABLE PerformanceTargets (
    target_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    target_name VARCHAR(200) NOT NULL,
    target_metric VARCHAR(100),
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    achievement_percentage AS (CASE WHEN target_value > 0 THEN (current_value / target_value) * 100 ELSE 0 END) PERSISTED,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
  );
END
GO

-- Bonus Calculations Table
IF OBJECT_ID('BonusCalculations', 'U') IS NULL
BEGIN
  CREATE TABLE BonusCalculations (
    calculation_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    period_month INT NOT NULL,
    period_year INT NOT NULL,
    bonus_rule_id INT NOT NULL,
    base_salary DECIMAL(10,2),
    target_achievement DECIMAL(5,2),
    calculated_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'calculated' CHECK (status IN ('calculated', 'approved', 'paid')),
    notes VARCHAR(500),
    calculated_by INT,
    calculated_date DATETIME2 DEFAULT GETDATE(),
    approved_by INT,
    approved_date DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (bonus_rule_id) REFERENCES BonusRules(bonus_rule_id),
    FOREIGN KEY (calculated_by) REFERENCES Users(user_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id)
  );
END
GO

-- Payroll Table
IF OBJECT_ID('Payroll', 'U') IS NULL
BEGIN
  CREATE TABLE Payroll (
    payroll_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    period_month INT NOT NULL,
    period_year INT NOT NULL,
    salary_base DECIMAL(10,2) NOT NULL,
    total_bonuses DECIMAL(10,2) DEFAULT 0,
    overtime_payment DECIMAL(10,2) DEFAULT 0,
    gross_salary AS (salary_base + total_bonuses + overtime_payment) PERSISTED,
    health_insurance_deduction DECIMAL(10,2) DEFAULT 0,
    social_insurance_deduction DECIMAL(10,2) DEFAULT 0,
    pit_deduction DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_deductions AS (health_insurance_deduction + social_insurance_deduction + pit_deduction + other_deductions) PERSISTED,
    net_salary AS (salary_base + total_bonuses + overtime_payment - health_insurance_deduction - social_insurance_deduction - pit_deduction - other_deductions) PERSISTED,
    payment_date DATE,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid', 'cancelled')),
    notes VARCHAR(500),
    created_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    approved_by INT,
    approved_date DATETIME2,
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id),
    CONSTRAINT UQ_Employee_Period UNIQUE (employee_id, period_month, period_year)
  );
END
GO

-- Performance Reviews Table
IF OBJECT_ID('PerformanceReviews', 'U') IS NULL
BEGIN
  CREATE TABLE PerformanceReviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    overall_rating DECIMAL(3,2),
    strengths VARCHAR(1000),
    areas_for_improvement VARCHAR(1000),
    goals_for_next_period VARCHAR(1000),
    employee_comments VARCHAR(1000),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'acknowledged', 'completed')),
    created_at DATETIME2 DEFAULT GETDATE(),
    submitted_date DATETIME2,
    acknowledged_date DATETIME2,
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id)
  );
END
GO

-- Performance Review Items Table
IF OBJECT_ID('PerformanceReviewItems', 'U') IS NULL
BEGIN
  CREATE TABLE PerformanceReviewItems (
    review_item_id INT IDENTITY(1,1) PRIMARY KEY,
    review_id INT NOT NULL,
    competency_name VARCHAR(200) NOT NULL,
    rating DECIMAL(3,2),
    comments VARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (review_id) REFERENCES PerformanceReviews(review_id) ON DELETE CASCADE
  );
END
GO

-- Documents Table
IF OBJECT_ID('Documents', 'U') IS NULL
BEGIN
  CREATE TABLE Documents (
    document_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
    uploaded_by INT,
    uploaded_at DATETIME2 DEFAULT GETDATE(),
    notes VARCHAR(500),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
  );
END
GO

-- Audit Log Table
IF OBJECT_ID('AuditLog', 'U') IS NULL
BEGIN
  CREATE TABLE AuditLog (
    audit_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values VARCHAR(MAX),
    new_values VARCHAR(MAX),
    ip_address VARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  );
END
GO

-- Insert default leave types
IF NOT EXISTS (SELECT 1 FROM LeaveTypes)
BEGIN
  INSERT INTO LeaveTypes (name, days_per_year, is_paid, requires_approval)
  VALUES
    ('Annual Leave', 20, 1, 1),
    ('Sick Leave', 14, 1, 1),
    ('Personal Leave', 5, 0, 1),
    ('Maternity Leave', 365, 1, 1),
    ('Paternity Leave', 10, 1, 1),
    ('Unpaid Leave', 0, 0, 1);
END
GO

-- Insert default bonus rule types
IF NOT EXISTS (SELECT 1 FROM BonusRuleTypes)
BEGIN
  INSERT INTO BonusRuleTypes (name, description, calculation_type)
  VALUES
    ('Performance Bonus', 'Based on individual performance targets', 'target_based'),
    ('Team Bonus', 'Based on team achievement', 'target_based'),
    ('Fixed Monthly Bonus', 'Fixed amount paid monthly', 'fixed'),
    ('Commission', 'Percentage-based on sales or collections', 'percentage'),
    ('Progressive Target Bonus', 'Increases with higher achievement levels', 'progressive'),
    ('Supervisor Bonus', 'For team leaders and supervisors', 'target_based');
END
GO

-- Insert default Albanian tax configuration (2024 rates - update as needed)
IF NOT EXISTS (SELECT 1 FROM TaxConfiguration)
BEGIN
  INSERT INTO TaxConfiguration (config_name, config_type, rate_percentage, threshold_min, threshold_max, effective_date, is_active, notes)
  VALUES
    ('Health Insurance Employee', 'health_insurance', 1.7, 0, NULL, '2024-01-01', 1, 'Employee contribution to health insurance'),
    ('Social Insurance Employee', 'social_insurance', 9.5, 0, NULL, '2024-01-01', 1, 'Employee contribution to social insurance'),
    ('PIT Bracket 1', 'personal_income_tax', 0, 0, 40000, '2024-01-01', 1, 'No tax up to 40,000 ALL'),
    ('PIT Bracket 2', 'personal_income_tax', 13, 40001, 200000, '2024-01-01', 1, '13% tax for 40,001 - 200,000 ALL'),
    ('PIT Bracket 3', 'personal_income_tax', 23, 200001, NULL, '2024-01-01', 1, '23% tax above 200,000 ALL'),
    ('Minimum Wage', 'minimum_wage', NULL, 40000, NULL, '2024-01-01', 1, 'Monthly minimum wage in Albania');
END
GO

-- Create indexes for performance
CREATE NONCLUSTERED INDEX IX_Employees_Department ON Employees(department);
CREATE NONCLUSTERED INDEX IX_Employees_Status ON Employees(status);
CREATE NONCLUSTERED INDEX IX_Attendance_Employee_Date ON Attendance(employee_id, date);
CREATE NONCLUSTERED INDEX IX_LeaveRequests_Employee ON LeaveRequests(employee_id);
CREATE NONCLUSTERED INDEX IX_LeaveRequests_Status ON LeaveRequests(status);
CREATE NONCLUSTERED INDEX IX_Payroll_Employee_Period ON Payroll(employee_id, period_year, period_month);
CREATE NONCLUSTERED INDEX IX_BonusCalculations_Employee_Period ON BonusCalculations(employee_id, period_year, period_month);
CREATE NONCLUSTERED INDEX IX_Documents_Employee ON Documents(employee_id);
GO

PRINT 'Database schema created successfully!';
PRINT 'Remember to create a default admin user for first login.';
GO
