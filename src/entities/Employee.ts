import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LeaveRequest } from './LeaveRequest';
import { Approval } from './Approval';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  role!: 'Employee' | 'Manager' | 'HR';

  // 👇 Employees have leave requests
  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests!: LeaveRequest[];

  // 👇 Employees (managers/HR) can approve leave requests through the Approval entity
  @OneToMany(() => Approval, (approval) => approval.approver)
  approvals!: Approval[];

  // 👇 Self-referencing: each employee can have a manager
  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager?: Employee;

  // 👇 One manager can have many subordinates
  @OneToMany(() => Employee, (employee) => employee.manager)
  subordinates?: Employee[];
}
