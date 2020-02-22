"use strict";

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/query");

const promptMessages = {
  viewEmployees: "View all employees",
  // viewEmployeesByDepartment: "View all employees by department",
  // viewEmployeesByRole: "View all employees by role",
  addEmployee: "Add an employee",
  updateEmployeeRole: "Update employee role",
  viewRoles: "View all roles",
  addRole: "Add a role",
  viewDepartment: "View all deparments",
  addDepartment: "Add a department",
  // deleteEmployee: "Delete an employee",
  // deleteRole: "Delete a role",
  // deleteDepartment: "Delete a department",
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
        promptMessages.addEmployee,
        promptMessages.updateEmployeeRole,
        promptMessages.viewRoles,
        promptMessages.addRole,
        promptMessages.viewDepartment,
        promptMessages.addDepartment,
        // promptMessages.deleteEmployee,
        // promptMessages.deleteRole,
        // promptMessages.deleteDepartment,
        promptMessages.exit
      ]
    });

    // console.log("answer", answer);
    switch (answer.action) {
      case promptMessages.viewEmployees:
        viewAllEmployees();
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

      case promptMessages.exit:
        exit();
        break;
      default:
        console.log("default");
    }
  } while (answer !== promptMessages.exit);
}

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

async function viewAllEmployees() {
  const res = await db.viewAllEmployees();
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

async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "department",
    type: "input",
    message: "What department would you like to add?"
  });

  const res = await db.addDepartment(answer.department);

  console.log(`Added ${answer.department} to the the database.`);
}

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
  resultEntry => answer.name === resultEntry.first_name + " " + resultEntry.last_name
);

const employeeId = employeeChoice.id;


const roleRecord = roles.find(
  resultEntry => resultEntry.title === answer.role
);
const roleId = roleRecord.id;

await db.updateEmployeeRole(roleId, employeeId);


console.log(`You successfully updated ${answer.name}'s role in the database.`);
}

 function exit() {
  db.exit();
}

// async function deleteEmployee() {
//   const employees = await db.findEmployee();

//   const employeeList = employees.map(record => {
//     return record.first_name.concat(" " + record.last_name);
//   });
//   const answer = await inquirer.prompt({
//     name: "name",
//     type: "list",
//     choices: employeeList
//   });

//   const res = await db.deleteEmployee();
//   console.log(`Deleted ${answer.name} from the database.`)
// }

prompt();
