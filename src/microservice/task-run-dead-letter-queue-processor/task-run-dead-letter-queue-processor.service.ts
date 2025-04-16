
import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { TaskStatus } from '@prisma/client'

@Injectable()
export class TaskRunDeadLetterQueueProcessorService {
  constructor(
    private readonly dbService: DBService
  ) { }

  async getTaskRequestByRunId(runId: string) {
    const taskRun = await this.dbService.taskRun.findUnique({ where: { id: runId } })
    if (!taskRun) {
      throw new Error(`Task run with ID ${runId} not found`)
    }
    return this.dbService.taskRequest.findUnique({ where: { id: taskRun.taskRequestId } })
  }

  async updateTaskRunsRetry(taskId: string, newValue) {
    return this.dbService.taskRequest.update({
      where: { id: taskId },
      data: {
        retryCount: newValue
      }
    })
  }

  async updateTaskStateToFailed(taskId: string) {
    return this.dbService.taskRequest.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.FAILED
      }
    })
  }

  async createNewTaskRun(taskRequestId: string) {
    return this.dbService.taskRun.create({ data: { taskRequestId: taskRequestId } })
  }
}
