DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_department_id
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_role_id
    FOREIGN KEY (role_id) 
        REFERENCES role(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_manager_id
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
    );




SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

