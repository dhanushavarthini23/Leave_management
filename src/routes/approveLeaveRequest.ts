import { LeaveRequest } from '../entities/LeaveRequest';
import { Approval } from '../entities/Approval';
import { ServerRoute } from '@hapi/hapi';
import { isManager } from '../middlewares/auth';
import { Employee } from '../entities/Employee';  // Import Employee entity

export const approveLeaveRequestRoute: ServerRoute = {
  method: 'PATCH',
  path: '/leave-requests/{id}/approve',
  options: {
    pre: [isManager],
    handler: async (request, h) => {
      const { id } = request.params;
      const { status, managerComments } = request.payload as any;
      const user = request.auth.credentials; // user injected by auth plugin

      const repo = request.server.app.dataSource.getRepository(LeaveRequest);
      const leave = await repo.findOneBy({ id: Number(id) });

      if (!leave || leave.status !== 'Pending') {
        return h.response({ message: 'Leave request not found or already processed' }).code(404);
      }

      leave.status = status;
      await repo.save(leave);

      const employeeRepo = request.server.app.dataSource.getRepository(Employee);
      const approver = await employeeRepo.findOne({ where: { id: user.id } });

      if (!approver) {
        return h.response({ message: 'Approver not found' }).code(404);
      }

      // Create the Approval record
      const approvalRepo = request.server.app.dataSource.getRepository(Approval);
      const approval = approvalRepo.create({
        leaveRequest: leave,    
        approver: approver,     
        level: 'manager',       
        status: status,        
        comments: managerComments,  
        approvalDate: new Date(),   
      });

      await approvalRepo.save(approval);

      return h.response({ message: `Leave request ${status} successfully` });
    }
  }
};
