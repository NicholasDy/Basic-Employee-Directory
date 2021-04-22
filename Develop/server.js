const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require("console.table");
const e = require("express");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password:  //insert password,
    database: 'directorydb',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    mainPage();
})


// inputs for the following for an employee 
// id ( personal id, role id, department id)
// first name 
// last name 
// manager ID --> who is this persons manager (can have a check list of names)
// salary
// department

//General task 

// Add departments, roles, employees

// View departments, roles, employees

// Update employee roles

function mainPage() {
    console.log("Welcome to the company directory!")
    inquirer.prompt([
        {
            type: "list",
            name: "main",
            message: "What would you like to do?",
            choices: ["View all Employees", "View all Employees by Department", "View all Employees by Role", "Add Employee", "Update Employee", "Add Roles", "Add Departments"]
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
                case "Add Employee":
                    addingEmp()
                    break;
                case "Update Employee":
                case "Add Roles":
                case "Add Departments":
            };
        })
};


// The questions for what the user wants to do are going to appear on the terminal 
//switch statment 
//Each of the seperate tasks is going to need a function for a total of 6 basic functions 
// SELECT
// FROM employee AS e
// JOIN roles AS r
// JOIN department AS d

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
};

function addingEmp() {
    console.log('prepare to add in new employee information')
    connection.query(`
    SELECT 
        r.title 
    FROM roles AS r`,
        (err, res) => {
            let listOfOptionsRoles = []
            for (let i = 0; i < res.length; i++) {
                let resPush = res[i].title
                listOfOptionsRoles.push(resPush)
            }
            connection.query(`
    SELECT
        CONCAT(e.firstName, ' ', e.lastName) AS Man
    FROM employee AS e
    `, (err, res) => {
                listOfOptionsMan = []
                for (let i = 0; i < res.length; i++) {
                    let resPush = res[i].Man
                    listOfOptionsMan.push(resPush)
                }
                listOfOptionsMan.push('--')
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
                    console.log(manager)

                    connection.query(`
                    INSERT INTO employee 
                        (firstName, lastName, roleID, managerID) 
                    VALUES
                        (${fname}, ${lname}, (SELECT idRole FROM roles WHERE title = ${roles}), 
                        (SELECT * FROM (
                            SELECT idEmp, CONCAT(firstName, " ",lastName) as firstlast
                            FROM employees) 
                            WHERE firstlast = ${manager})
                    `)
                })
            })

        })
}

