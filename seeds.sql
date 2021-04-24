INSERT INTO department (idDepart, departID) VALUES (1, "Sales"), (2, "Accounting"), (3, "Maintenance");

INSERT INTO roles (idRole, title, salary, department_id) VALUES (1, "Sales Manager", 90000, 1), (2, "Sales Rep", 75000, 1), (3, "Accounting Manager", 10000, 2), (4, "Accountant", 90000, 2), (5, "Maintence Manager", 75000, 3), (6, "Technician", 50000, 3);

INSERT INTO employee (idEmp, firstName, lastName, roleID, managerID) VALUES (1, "Nick", "Dyke", 1, Null), (2, "Josh", "Russel", 2, Null), (3, "Ann", "Katherine", 3, Null), (4, "Jim", "Russel", 4, 3), (5, "Katie", "Kei", 5, 1)

-- 1 - 9 is Head management, 10 - 19 is sales, 20 - 29 is accounting, 30 - 39 Maintenance