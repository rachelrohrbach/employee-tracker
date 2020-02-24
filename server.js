"use strict";

const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connectorClass");

const promptMessages = {
  viewEmployees: "View all Employees",
  viewEmployeesByDepartment: "View all Employees by Department",
  viewEmployeesByRole: "View all Employees by Role",
  viewDepartment: "View all Departments",
  viewRoles: "View all Roles",
  addEmployee: "Add an Employee",
  addDepartment: "Add a Department",
  addRole: "Add a Role",
  updateEmployeeRole: "Update Employee Role",
  deleteEmployee: "Delete an Employee",
  deleteRole: "Delete a Role",
  deleteDepartment: "Delete a Department",
  exit: "Exit"
};

async function prompt() {
  let answer;
  do {
    answer = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        promptMessages.viewEmployees,
        promptMessages.viewEmployeesByDepartment,
        promptMessages.viewEmployeesByRole,
        promptMessages.viewDepartment,
        promptMessages.viewRoles,
        promptMessages.addEmployee,
        promptMessages.addDepartment,
        promptMessages.addRole,
        promptMessages.updateEmployeeRole,
        promptMessages.deleteEmployee,
        promptMessages.deleteRole,
        promptMessages.deleteDepartment,
        promptMessages.exit
      ]
    });

    switch (answer.action) {
      case promptMessages.viewEmployees:
        await viewAllEmployees();
        break;

      case promptMessages.viewEmployeesByDepartment:
        await viewEmployeesByDepartment();
        break;

      case promptMessages.viewEmployeesByRole:
        await viewEmployeesByRole();
        break;

      case promptMessages.addEmployee:
        await addEmployee();
        break;

      case promptMessages.updateEmployeeRole:
        await updateEmployeeRole();
        break;

      case promptMessages.viewRoles:
        await viewAllRoles();
        break;

      case promptMessages.addRole:
        await addRole();
        break;

      case promptMessages.viewDepartment:
        await viewAllDepartments();
        break;

      case promptMessages.addDepartment:
        await addDepartment();
        break;

      case promptMessages.deleteEmployee:
        await deleteEmployee();
        break;

      case promptMessages.deleteRole:
        await deleteRole();
        break;

      case promptMessages.deleteDepartment:
        await deleteDepartment();
        break;

      case promptMessages.exit:
        exit();
        break;
      default:
        console.log("default");
    }
  } while (answer !== promptMessages.exit);
}

// View Functions
async function viewAllEmployees() {
  const res = await db.viewAllEmployees();
  console.table("", res);
}

async function viewEmployeesByDepartment() {
  const departments = await db.viewAllDepartments();

  const departmentList = departments.map(record => {
    return record.name;
  });
  const answer = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "Which department are you interested in?",
    choices: departmentList
  });

  const departmentRecord = departments.find(resultEntry => {
    // console.log(answer.department === resultEntry.name);
    return answer.department === resultEntry.name;
  });
  const departmentId = departmentRecord.id;

  const res = await db.viewEmployeesByDepartment(departmentId);
  console.table("", res);
}

async function viewEmployeesByRole() {
  const roles = await db.viewAllRoles();

  const roleList = roles.map(record => {
    return record.title;
  });

  const answer = await inquirer.prompt({
    name: "role",
    type: "list",
    message: "Which role are you interested in?",
    choices: roleList
  });

  const roleRecord = roles.find(
    resultEntry => resultEntry.title === answer.role
  );
  const roleId = roleRecord.id;

  const res = await db.viewEmployeesByRole(roleId);
  console.table("", res);
}

async function viewAllRoles() {
  const res = await db.viewAllRoles();
  console.table("", res);
}

async function viewAllDepartments() {
  const res = await db.viewAllDepartments();
  console.table("", res);
}

// Add Functions 
async function addEmployee() {
  const roles = await db.findRoles();

  const roleList = roles.map(record => {
    return record.title;
  });

  const employees = await db.findEmployee();

  const employeeList = employees.map(record => {
    return record.first_name.concat(" " + record.last_name);
  });

  employeeList.unshift("None");

  const answer = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role",
      type: "list",
      message: "What is the employee's role?",
      choices: roleList
    },
    {
      name: "manager",
      type: "list",
      message: "What is the manager's name?",
      choices: employeeList
    }
  ]);

  let managerId;
  if (answer.manager !== "None") {
    const managerRecord = employees.find(
      resultEntry =>
        answer.manager === resultEntry.first_name + " " + resultEntry.last_name
    );

    managerId = managerRecord.id;
  }
  const roleRecord = roles.find(
    resultEntry => resultEntry.title === answer.role
  );
  const roleId = roleRecord.id;

  await db.addEmployee(answer.firstName, answer.lastName, roleId, managerId);

  console.log(`You successfully added ${answer.firstName} to the database.`);
}

async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "department",
    type: "input",
    message: "What department would you like to add?"
  });

  const res = await db.addDepartment(answer.department);

  console.log(`Added ${answer.department} to the the database.`);
}
async function addRole() {
  const answer = await inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "What role would you like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for that role?"
    }
  ]);

  const res = await db.addRole(answer.role, answer.salary);
  console.log(`Added ${answer.role} to the the database.`);
}

// Update Function(s)
async function updateEmployeeRole() {
  const employees = await db.findEmployee();

  const employeeList = employees.map(record => {
    return record.first_name.concat(" " + record.last_name);
  });

  const roles = await db.findRoles();

  const roleList = roles.map(record => {
    return record.title;
  });

  const answer = await inquirer.prompt([
    {
      name: "name",
      type: "list",
      message: "Which employee do you want to update?",
      choices: employeeList
    },
    {
      name: "role",
      type: "list",
      message: "What is the employee's updated role?",
      choices: roleList
    }
  ]);

  const employeeChoice = employees.find(
    resultEntry =>
      answer.name === resultEntry.first_name + " " + resultEntry.last_name
  );

  const employeeId = employeeChoice.id;

  const roleRecord = roles.find(
    resultEntry => resultEntry.title === answer.role
  );
  const roleId = roleRecord.id;

  await db.updateEmployeeRole(roleId, employeeId);

  console.log(
    `You successfully updated ${answer.name}'s role in the database.`
  );
}

// Delete Functions
async function deleteEmployee() {
  const employees = await db.findEmployee();

  const employeesList = employees.map(record => {
    return record.first_name.concat(" " + record.last_name);
  });
  const answer = await inquirer.prompt({
    type: "list",
    name: "employee",
    message: "Which employee do you want to delete?",
    choices: employeesList
  });

  const employeeChoice = employees.find(resultEntry => {
    // console.log("answer.name: [" + answer.employee + "] === resultEntry.first_name + \" \" + resultEntry.last_name: [" + resultEntry.first_name + " " + resultEntry.last_name + "]");
    return (
      answer.employee === resultEntry.first_name + " " + resultEntry.last_name
    );
  });

  const employeeId = employeeChoice.id;
  await db.deleteEmployee(employeeId);
  console.log(`Deleted ${answer.name} from the database.`);
}

async function deleteDepartment() {
  const departments = await db.viewAllDepartments();

  const departmentList = departments.map(record => {
    return record.name;
  });
  const answer = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "Which department are you interested in?",
    choices: departmentList
  });

  const departmentRecord = departments.find(resultEntry => {
    return answer.department === resultEntry.name;
  });
  const departmentId = departmentRecord.id;

  const res = await db.deleteDepartment(departmentId);
  console.log(`Succesfully deleted ${answer.name} from the database.`);
}

async function deleteRole() {
  const roles = await db.viewAllRoles();

  const roleList = roles.map(record => {
    return record.title;
  });

  const answer = await inquirer.prompt({
    name: "role",
    type: "list",
    message: "Which role are you interested in?",
    choices: roleList
  });

  const roleRecord = roles.find(
    resultEntry => resultEntry.title === answer.role
  );
  const roleId = roleRecord.id;

  const res = await db.deleteRole(roleId);
  console.log(`Succesfully deleted ${answer.title} from the database.`);
}

function exit() {
  db.exit();
}

prompt();
