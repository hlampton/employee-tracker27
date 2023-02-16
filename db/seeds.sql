-- Inserts names of departments into department table
INSERT INTO department
(name)
VALUES
('Engineering'), -- Department 1
('Sales'), -- Department 2
('Finance'), -- Department 3
('Legal'); -- Department 4

-- Inserts roles of employees into the role table
INSERT INTO role
(title, salary, department_id)
VALUES
('Software Engineer', 85000, 1), -- Role 1
('Salesperson', 75000, 2), -- Role 2
('Accountant', 125000, 3), -- Role 3
('Lawyer', 200000, 4); -- Role 4

-- Inserts employee information into the employee table
INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('Juan', 'Garcia', 1, 4), -- Employee 1
('Jonathan', 'Villcapoma', 2, 3), -- Employee 2
('Jesus', 'Meraz', 3, 1), -- Employee 3
('Syndrome', 'Monkey', 4, 5); -- Employee 4