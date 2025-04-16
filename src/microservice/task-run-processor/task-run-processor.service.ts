
import { Injectable } from '@nestjs/common';
import { MessageProducerService } from 'src/lib/message-producer/message-producer.service';
import { RunStatus, TaskStatus } from '@prisma/client'
import { DBService } from 'src/db/db.service';

@Injectable()
export class TaskRunProcessorService {
  constructor(
    private readonly messageProducerService: MessageProducerService,
    private readonly dbService: DBService
  ) { }

  changeTaskRunStatus(runId: string, status: RunStatus, additionalData?: any) {
    return this.dbService.$transaction(async prisma => {
      const payload: { status: RunStatus, finishAt?: Date, startedAt?: Date } = { status }

      if (status === RunStatus.COMPLETED || status === RunStatus.FAILED) {
        payload.finishAt = new Date()
      }

      if (status === RunStatus.COMPLETED || status === RunStatus.FAILED) {
        payload.startedAt = new Date
      }

      const updatedRun = await prisma.taskRun.update({
        where: { id: runId },
        data: payload
      })

      if (status === RunStatus.COMPLETED || status === RunStatus.PROCESSING) {
        const taskStatus = status === RunStatus.COMPLETED ? TaskStatus.COMPLETED : TaskStatus.PROCESSING
        await prisma.taskRequest.update({
          where: { id: updatedRun.taskRequestId },
          data: {
            status: taskStatus,
          }
        })
      }

      this.messageProducerService.emitTaskRunEventPublish(runId, { status, additionalData: { ...additionalData } }).subscribe({
        error: (err) => {
          console.error('Error publishing task run status changed event', JSON.stringify(err));
        },
      })
    })
  }


  sentMessageToDQL(runId: string) {
    return this.messageProducerService.emitTaskRunError(runId).subscribe({
      next: () => {
        console.log('Task Run sent to DQL');
      },
      error: (err) => {
        console.error('Error publishing task sent to DQL', JSON.stringify(err));
      },
    })
  }
}





