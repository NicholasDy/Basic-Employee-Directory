const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require("console.table")

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: , //insert password,
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
            choices: ["View all Employees", "View all Employees by Department", "View all Employees by Role", "Add Employee", "Update Employee", "Update Roles", "Update Departments"]
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
                case "Update Employee":
                case "Update Roles":
                case "Update Departments":
            };
        })
};


// The questions for what the user wants to do are going to appear on the terminal 
//switch statment 
//Each of the seperate tasks is going to need a function for a total of 6 basic functions 


function viewAllEmp() {
    connection.query("SELECT * FROM employee;",
        (err, res) => {
            console.table(res);
            mainPage();
        }
    )
};

function viewEmpDepart() {
    connection.query("SELECT departID FROM department",
        (err, res) => {
            let listOfOptions = [] 
            for(let i = 0; i < res.length; i++ ){
                let resPush = res[i].departID
                listOfOptions.push(resPush)
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which department would you like to see?",
                    name:"depart",
                    choices: listOfOptions
                }
            ])
            .then(answers => {
                connection.query(`
                SELECT 
                    * 
                FROM 
                    employee AS e
                INNER JOIN
                    department AS d
                WHERE
                    d.departID = ${answers.depart}
                    `,
                (err, res) => {
                    console.table(res);
                    mainPage();
                }
            )
            })
            
        })
};

function viewEmpRole() {

};