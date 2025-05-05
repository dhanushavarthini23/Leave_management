import AppDataSource from './data-source';
import { Employee } from './entities/Employee';
import { LeaveRequest } from './entities/LeaveRequest';
import { Approval } from './entities/Approval';

async function seed() {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized.');

  // Sync the schema (only for development purposes)
  await AppDataSource.synchronize();

  // Create Employees and other entities (same as before)
  const employees: Employee[] = [];

  const hr = new Employee();
  hr.name = 'Helen HR';
  hr.email = 'hr@example.com';  // Ensure this is unique
  hr.role = 'HR';
  employees.push(hr);

  const manager1 = new Employee();
  manager1.name = 'Mike Manager';
  manager1.email = 'manager1@example.com';  // Ensure this is unique
  manager1.role = 'Manager';
  employees.push(manager1);

  const manager2 = new Employee();
  manager2.name = 'Sarah Manager';
  manager2.email = 'manager2@example.com';  // Ensure this is unique
  manager2.role = 'Manager';
  employees.push(manager2);

  const employeeNames = [
    'John Doe', 'Alice Brown', 'Bob White', 'Charlie Green', 'Diana Black',
    'Eve Adams', 'Frank Clark', 'Grace Lewis', 'Henry Scott'
  ];

  for (let i = 0; i < 9; i++) {
    const emp = new Employee();
    emp.name = employeeNames[i];
    emp.email = `employee${i + 1}@example.com`;  // Ensure unique email for each employee
    emp.role = 'Employee';

    // Assigning employees to manager1 or manager2 based on index
    emp.manager = i < 5 ? manager1 : manager2; // First 5 report to manager1, rest to manager2
    employees.push(emp);
  }

  await AppDataSource.manager.save(employees);
  console.log('10 employees saved');

  // Create leave requests for employees 3, 4, and 5
  const leaveRequests: LeaveRequest[] = [];

  for (let i = 3; i <= 5; i++) { // Employees 3, 4, 5 (index 3, 4, 5)
    const leave = new LeaveRequest();
    leave.employee = employees[i];
    leave.manager = manager1; // Assign to Manager 1
    leave.startDate = new Date(`2025-05-${10 + i}`);
    leave.endDate = new Date(`2025-05-${11 + i}`);
    leave.reason = `Personal leave by ${employees[i].name}`;
    leave.status = 'Pending';

    await AppDataSource.manager.save(leave);
    leaveRequests.push(leave);
    console.log(`LeaveRequest for ${employees[i].name} saved`);

    // Create approvals for the leave request
    const approval1 = new Approval();
    approval1.leaveRequest = leave;
    approval1.approver = manager1;
    approval1.level = 'manager';
    approval1.status = 'Pending'; // Set status to 'Pending' initially

    const approval2 = new Approval();
    approval2.leaveRequest = leave;
    approval2.approver = hr;
    approval2.level = 'hr';
    approval2.status = 'Pending'; // Set status to 'Pending' initially

    await AppDataSource.manager.save([approval1, approval2]);
    console.log(`Approvals for ${employees[i].name} saved`);
  }

  // Close the connection
  await AppDataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
});
