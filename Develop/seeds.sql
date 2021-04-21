INSERT INTO department (idDepart, departID) VALUES (1, "Sales"), (2, "Accounting"), (3, "Maintenance");

-- 1 - 9 is Head management, 10 - 19 is sales, 20 - 29 is accounting, 30 - 39 Maintenance

INSERT INTO roles (idRole, title, salary, department_id) VALUES (10, "Sales Manager", 90000, 1), (11, "Sales Rep", 75000, 1), (20, "Accounting Manager", 10000, 2), (21, "Accountant", 90000, 2), (30, "Maintence Manager", 75000, 3), (31, "Technician", 50000, 3);

INSERT INTO employee (idEmp, firstName, lastName, roleID, managerID) VALUES (1, "Nick", "Dyke", 10, Null), (2, "Josh", "Russel", 20, Null), (3, "Ann", "Katherine", 30, Null), (4, "Jim", "Russel", 31, 3), (5, "Katie", "Kei", 11, 1)

