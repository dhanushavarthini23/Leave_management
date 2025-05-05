import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Employee } from './Employee';
import { Approval } from './Approval';

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;  // Who is requesting leave

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager!: Employee | null;  // Who approved it (if > 5 days and assigned)

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column()
  reason!: string;

  @Column({ default: 'Pending' })
  status!: 'Pending' | 'Approved' | 'Rejected';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Approval, (approval) => approval.leaveRequest)
  approvals!: Approval[];  // This will track all the approval records related to this leave request.

  // 👇 Remove manager approval fields from here, as they will be handled in the Approval entity
  // @Column({ default: false })
  // isManagerApproved!: boolean;

  // @Column({ default: false })
  // isHRApproved!: boolean;
}
