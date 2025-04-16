import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';

@Injectable()
export class RunService {
  constructor(private readonly dbService: DBService) { }

  createNewTaskRun(taskRequestId: string) {
    return this.dbService.taskRun.create({ data: { taskRequestId } })
  }
}
