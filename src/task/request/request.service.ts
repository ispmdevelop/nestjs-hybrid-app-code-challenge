import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { Prisma } from '@prisma/client'
import { RunService } from '../run/run.service';

@Injectable()
export class RequestService {

  constructor(
    private readonly dbService: DBService,
    private readonly runService: RunService,
  ) { }

  createNewRequestAndRun(data: Prisma.TaskRequestCreateInput) {
    return this.dbService.$transaction(async (prisma) => {
      const request = await prisma.taskRequest.create({ data })
      const run = await prisma.taskRun.create({ data: { taskRequestId: request.id } })
      return { request, run }
    })
  }


  getRequests(args: Prisma.TaskRequestFindManyArgs) {
    return this.dbService.taskRequest.findMany(args)
  }
}
