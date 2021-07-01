const mySQL = require('mysql');
const inquirer = require('inquirer');
const consoletable = require('console.table')

const connection = mySQL.createConnection({
    host: 'localhost',

    port:3306,

    user: 'root',

    password: 'mysqlserver',
    database: 'employeeDB',
});

const getDepartments = () => {
    return connection.promise().query("SELECT * FROM department")
};

const getEmployees = () => {
    return connection.promise().query("SELECT * FROM employee")
};

const getRoles = () => {
    return connection.promise().query("SELECT * FROM role")
}
const start = () => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "Add a department",
                "View all employees",
                "Add an employee",
                "Update an employee role",
                "View all roles",
                "Add a role",
                "Exit"
            ]
        }
    ]).then (function (answers)  {
        switch (answers.menu) {
            case "View all departments":
                viewAllDepartments();
                break;
        
            case "Add a department":
                addNewDepartment();
                break;

            case "View all employees":
                viewAllEmployees();
                break;

            case "Add an employee":
                addNewEmployee();
                break;

            case "Update an employee role":
                updateEmployeeRole();
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "Add a role":
                addNewRole();
                break;

            case "Exit":
                console.log("Goodbye");
                connection.end();
                break
        }
    })
};

const viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err
        console.log("\n Departments in database \n");
        console.log(res);
        console.table(res);
        start();
    })
};

const addNewDepartment = () => {
    inquirer.prompt ({
        type:"input",
        name:"newDepartment",
        message:"What is the name of the new department?"
    }).then(function(input) {
        connection.query('INSERT INTO department SET ?',
        {
            name: input.newDepartment
        },
        function (err,res) {
            if (err) throw err;
            console.log("New department added!");
            start();
        });
    });
};

const viewAllEmployees = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err
        console.log("\n All employees \n");
        console.table(res);
        start();
    });
};

const addNewEmployee = () => {
    inquirer.prompt([
        {
            type:"input",
            name:"firstName",
            message:"What is the new employees first name?"
        },
        {
            type:"input",
            name:"lastName",
            message:"What is the new employees last name?"
        },
        {
            type:"input",
            name:"roleID",
            message:"What is the employees role ID?"
        },
        {
            type:"input",
            name:"managerID",
            message:"What is the new employees managers ID?"
        }
    ]).then((answer) => {
        connection.query('INSERT INTO employee SET ?',
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleID,
            manager_id: answer.managerID
        },
        (err) => {
            if (err) throw err;
            console.log("New employee added successfully!");
            start();
        })
    });
};

const viewAllRoles = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        console.log("\n All Roles \n");
        console.log(res);
        console.table(res);
        start();
    })
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "roleUpdate",
                message: "What is the employees new role ID?"
            },
            {
                type: "input",
                name: "managerUpdate",
                message: "What is the new roles manager ID?"
            }
        ])
        .then((answer) => {
            connection.query("UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answer.roleUpdate
                },
                {
                    manager_id: answer.managerUpdate
                },
            ],
            (error) => {
                if (err) throw err;
                console.log("Employee role updated successfully!");
                start();
            })
        });
    });
};

const addNewRole = () => {
    inquirer.prompt([
        {
            type:"input",
            name:"roleTitle",
            message:"What is the new role title?"
        },
        {
            type:"input",
            name:"roleSalary",
            message:"What is the new roles salary?"
        },
        {
            type:"input",
            name:"roleDepartment",
            message:"What is the new roles department id?"
        }
    ]).then((answer) => {
        connection.query('INSERT INTO role SET ?',
        {
            title: answer.roleTitle,
            salary: answer.roleSalary,
            department_id: answer.roleDepartment
        },
        (err) => {
            if (err) throw err;
            console.log("New role added successfully");
            start();
        })
    })
}

start()