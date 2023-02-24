const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Define a function to handle the command prompt
async function promptUser() {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Department',
        'View All Roles',
        'View All Employees',
        'Add A Department',
        'Add A Role',
        'Add An Employee',
        'Update An Employee Role',
        'Log Out',
      ],
    });
    return answer.action;
  }
  
  // Define functions to handle database queries
  async function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    const [rows, fields] = await db.query(query);
    console.log('Viewing All Departments: ');
    console.table(rows);
  }
  
  async function viewAllRoles() {
    const query = `SELECT * FROM role`;
    const [rows, fields] = await db.query(query);
    console.log('Viewing All Roles: ');
    console.table(rows);
  }
  
  async function viewAllEmployees() {
    const query = `SELECT * FROM employee`;
    const [rows, fields] = await db.query(query);
    console.log('Viewing All Employees: ');
    console.table(rows);
  }
  
  async function addDepartment() {
    const answer = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
      validate: (input) => {
        return input.trim().length > 0 || 'Please Add A Department!';
      },
    });
    const query = `INSERT INTO department (name) VALUES (?)`;
    const [result, fields] = await db.query(query, answer.name);
    console.log(`Added ${answer.name} to the database.`);
  }
  
  async function addRole() {
    const [departmentRows, departmentFields] = await db.query(`SELECT * FROM department`);
    const departmentChoices = departmentRows.map((row) => row.name);
  
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?',
        validate: (input) => {
          return input.trim().length > 0 || 'Please Add A Role!';
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
        validate: (input) => {
          return input.trim().length > 0 || 'Please Add A Salary!';
        },
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departmentChoices,
      },
    ]);
  
    const department = departmentRows.find((row) => row.name === answers.department);
    const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const [result, fields] = await db.query(query, [answers.title, answers.salary, department.id]);
    console.log(`Added ${answers.title} to the database.`);
  }
  
  async function updateEmployeeRole() {
    const [result, fields] = await db.query(`SELECT * FROM employee`);
  
    inquirer.prompt([
            {
                // Select employee to update
                type: 'list',
                name: 'employee',
                message: 'Which employee do you want to update?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].first_name + ' ' + result[i].last_name);
                    }
                    return array;
                }
            },
            {
                // Select the new role for the employee
                type: 'list',
                name: 'role',
                message: 'What is the new role for the employee?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            }
        ]).then((answers) => {
            // Find the employee and role IDs
            var employeeId;
            var roleId;
        
            for (var i = 0; i < result.length; i++) {
                if ((result[i].first_name + ' ' + result[i].last_name) === answers.employee) {
                    employeeId = result[i].id;
                }
                if (result[i].title === answers.role) {
                    roleId = result[i].id; // Changed to roleId = result[i].id
                }
            }
        
            // Update the employee's role
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, employeeId], (err, result) => {
                if (err) throw err;
                console.log(`Updated employee's role in the database.`);
                employee_tracker();
            });
        })
        .then(() => {
            // Added a then block for the following prompt
            inquirer.prompt({
                type: 'list',
                name: 'prompt',
                message: 'What would you like to do?',
                choices: ['View all employees', 'View all roles', 'View all departments', 'Add employee', 'Add role', 'Add department', 'Update employee role', 'Log Out']
            }).then((answers) => {
                if (answers.prompt === 'View all employees') {
                    viewAllEmployees();
                } else if (answers.prompt === 'View all roles') {
                    viewAllRoles();
                } else if (answers.prompt === 'View all departments') {
                    viewAllDepartments();
                } else if (answers.prompt === 'Add employee') {
                    addEmployee();
                } else if (answers.prompt === 'Add role') {
                    addRole();
                } else if (answers.prompt === 'Add department') {
                    addDepartment();
                } else if (answers.prompt === 'Update employee role') {
                    updateEmployeeRole();
                } else if (answers.prompt === 'Log Out') {
                    console.log('Goodbye.');
                    process.exit();
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

async function start() {
  while (true) {
    const action = await promptUser();
    switch (action) {
      case 'View All Department':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add A Department':
        await addDepartment();
        break;
      case 'Add A Role':
        await addRole();
        break;
      case 'Add An Employee':
        await addEmployee();
        break;
      case 'Update An Employee Role':
        await updateEmployeeRole();
        break;
      case 'Log Out':
        console.log('Goodbye!');
        db.end();
        return;
      default:
        console.log(`Invalid action: ${action}`);
        break;
    }
  }
}

start();
