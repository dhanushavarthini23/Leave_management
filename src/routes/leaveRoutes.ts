import { LeaveRequest } from '../entities/LeaveRequest';
import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { isManager } from '../middlewares/auth';
const getPendingLeaveRequestsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/leave-requests/pending',
  options: {
    //pre: [isManager],
    handler: async (request: Request, h: ResponseToolkit) => {
      const repo = (request.server.app as any).dataSource.getRepository(LeaveRequest);
      const pending = await repo.find({
        where: { status: 'Pending' },
        relations: ['employee'],
      });
      return h.response(pending);
    },
  },
};

export default getPendingLeaveRequestsRoute;
