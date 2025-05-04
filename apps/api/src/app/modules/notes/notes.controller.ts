import { IdParams } from '@project/shared';
import { FastifyReply, FastifyRequest } from 'fastify';

export class NotesController {
  static async getOne(
    req: FastifyRequest<NotesGetOne>,
    res: FastifyReply
  ) {
    const { id } = req.params;
    // const adminService = servicesContainer.get(AdminService);
    // return res.send(
    //   await adminService.getConditionStats({
    //     conditionId: id,
    //   })
    // );
  }
}

export interface NotesGetOne {
  Params: IdParams;
}

// export interface AdminGetConditionsStatsRequest {
//   Params: IdParams;
//   Body: {
//     serviceId: number;
//     conditionIds?: string[];
//   };
// }
