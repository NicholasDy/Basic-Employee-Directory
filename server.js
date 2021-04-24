const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require("console.table");
const e = require("express");


let listOfOptionsRoles = [];
let listOfOptionsMan = [];
let listofDepart = [];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "Nikkus94!", //insert password,
    database: 'directorydb',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    mainPage();
    getEmployee();
    getEmployeeMan();
})

function mainPage() {
    console.log("Welcome to the company directory!")
    inquirer.prompt([
        {
            type: "list",
            name: "main",
            message: "What would you like to do?",
            choices: ["View all Employees", "View all Employees by Department", "View all Employees by Role", "View all Roles", "View all Departments", "Add Employee", "Add Roles", "Add Departments", "Update Employee Role"]
        }
    ])
        .then(answers => {
            switch (answers.main) {
                case "View all Employees":
                    viewAllEmp()
                    break;
                case "View all Employees by Department":
                    viewEmpDepart()
                    break;
                case "View all Employees by Role":
                    viewEmpRole()
                    break;
                case "View all Roles":
                    viewRoles()
                    break;
                case "View all Departments":
                    viewDepart()
                    break;
                case "Add Employee":
                    addingEmp()
                    break;
                case "Add Roles":
                    addingRoles()
                    break;
                case "Add Departments":
                    addingDepart()
                    break;
                case "Update Employee Role":
                    updateRoles()
                    break;
            };
        })
};

//Viewing functions 
function viewAllEmp() { //might want to add more info in the table when it comes out see the readme
    connection.query(`
    SELECT
        e.firstName, 
        e.lastName, 
        r.salary,
        r.title,
        d.departID, 
        CONCAT(m.firstName,' ', m.lastName) AS Manager
    FROM employee AS e
    JOIN roles AS r
        ON e.roleID = r.idRole
    JOIN department AS d
        ON r.department_id = d.idDepart 
    LEFT JOIN employee AS m ON m.idEmp = e.managerID
    `, (err, res) => {
        if (err) throw err
        console.table(res);
        mainPage();
    }
    )
};

function viewEmpDepart() {
    connection.query(`
    SELECT 
        e.firstName, 
        e.lastName, 
        d.departID AS Department
    FROM employee AS e
    JOIN roles AS r
        ON e.roleID = r.idRole
    JOIN department AS d
        ON r.department_id = d.idDepart ORDER BY e.roleID;`, (err, res) => {
        if (err) throw err
        console.table(res)
        mainPage()
    })
}

function viewEmpRole() {
    connection.query(`
    SELECT
        e.firstName,
        e.lastName, 
        r.title
    FROM employee AS e
    INNER JOIN roles AS r
        ON e.roleID = r.idRole ORDER BY r.idRole
    `, (err, res) => {
        if (err) throw err
        console.table(res)
        mainPage()
    })
}

function viewDepart() {
    connection.query(`
    SELECT * FROM department
    `, (err, res) => {
        if (err) throw err
        console.table(res);
        mainPage();
    })
}

function viewRoles() {
    connection.query(`
    SELECT * FROM roles
    `, (err, res) => {
        if (err) throw err
        console.table(res);
        mainPage();
    })
}

//adding functions 
function addingEmp() {
    inquirer.prompt([
        {
            type: "input",
            name: "fname",
            message: "What is your employee's first name?",
        },
        {
            type: "input",
            name: "lname",
            message: "What is your employee's last name?",
        },
        {
            type: "list",
            name: "roles",
            message: "What is your employee's Role?",
            choices: listOfOptionsRoles,
        },
        {
            type: "list",
            name: "manager",
            message: "What is your employee's Manager?",
            choices: listOfOptionsMan,
        },
    ]).then(({ fname, lname, roles, manager }) => {

        let managedId = employeeID(manager)
        let roledId = getRoleId(roles)
        connection.query(`
        INSERT INTO employee SET ?`,
            {
                firstName: fname,
                lastName: lname,
                managerId: managedId,
                roleId: roledId

            }, (err, res) => {
                if (err) throw err
                mainPage()
            })
    })
}
function addingRoles() {
    getDepartment();
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the Role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of said Role?",
        },
        {
            type: "list",
            name: "deparment",
            message: "What is your employee's Manager?",
            choices: listofDepart,
        },
    ]).then(({ title, salary, deparment }) => {

        let depID = getDepartId(deparment)
        connection.query(`
            INSERT INTO roles SET ?`,
            {
                title: title,
                salary: salary,
                department_id: depID
            },
            (err, res) => {
                if (err) throw err
                mainPage()
            })
    })
}
function addingDepart() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the department??",
        },

    ]).then((answers) => {
        connection.query(`
            INSERT INTO department SET ?`,
            {
                departID: answers.title,
            },
            (err, res) => {
                if (err) throw err
                mainPage()
            })
    })
}

//updating roles
function updateRoles() {
    inquirer.prompt([
        {
            type: "list",
            name: "person",
            message: "Whose role are you updating?",
            choices: listOfOptionsMan,
        },
        {
            type: "list",
            name: "role",
            message: "What is their new role?",
            choices: listOfOptionsRoles,
        }
    ]).then(({ person, role }) => {
        let managedId = employeeID(person)
        let roledId = getRoleId(role)
        connection.query(`
        UPDATE employee
        SET roleID = ${roledId}
        WHERE idEmp = ${managedId}
        `, (err, res) => {
            if (err) throw err
            viewEmpRole()
        })

    })
}

// getting ID functions

function employeeID(manager) {
    for (let i = 0; i < listOfOptionsMan.length; i++) {
        if (manager == listOfOptionsMan[i]) {
            managedId = i + 1
        }
    }
    return managedId
}
function getRoleId(roles) {
    for (let i = 0; i < listOfOptionsRoles.length; i++) {
        if (roles == listOfOptionsRoles[i]) {
            roledId = i + 1
        }
    }
    return roledId
}
function getDepartId(deparment) {
    console.log(listofDepart.length)
    for (let i = 0; i < listofDepart.length; i++) {
        if (deparment == listofDepart[i]) {
            depID = i + 1
            console.log(i)
        }
    }
    console.log(depID)
    return depID
}

//creating array functions 
function getEmployee() {
    console.log('getting roles')
    connection.query(`
SELECT 
r.title 
FROM roles AS r`,
        (err, res) => {
            for (let i = 0; i < res.length; i++) {
                let resPush = res[i].title
                listOfOptionsRoles.push(resPush)
            }
        })
    return;
}
function getEmployeeMan() {
    connection.query(`  
    SELECT
        CONCAT(e.firstName, ' ', e.lastName) AS Man
    FROM employee AS e
        `, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let resPush = res[i].Man
            listOfOptionsMan.push(resPush)
        }
        listOfOptionsMan.push('--')
    })
    return;
}
function getDepartment() {
    connection.query(`
    SELECT departID FROM department
    `, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let resPush = res[i].departID
            listofDepart.push(resPush)
        }
    })
    return;
}