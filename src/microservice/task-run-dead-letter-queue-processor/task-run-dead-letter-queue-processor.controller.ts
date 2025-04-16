import { Controller } from '@nestjs/common';
import { TaskRunDeadLetterQueueProcessorService } from './task-run-dead-letter-queue-processor.service';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ProcessJobRunDto } from '../task-run-processor/dto/process-job-run.dto';
import { MessageProducerService } from 'src/lib/message-producer/message-producer.service';

@Controller()
export class TaskRunDeadLetterQueueProcessorController {
  constructor(
    private readonly taskRunDeadLetterQueueProcessorService: TaskRunDeadLetterQueueProcessorService,
    private readonly messageProducerService: MessageProducerService,
  ) { }

  @MessagePattern('task.run.error')
  async processJobError(@Payload() data: ProcessJobRunDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const taskRequest = await this.taskRunDeadLetterQueueProcessorService.getTaskRequestByRunId(data.taskRunId);
      if (!taskRequest) {
        throw new Error(`Task request with ID ${data.taskRunId} not found`)
      }
      if (taskRequest?.maxRetries > taskRequest?.retryCount) {
        await this.taskRunDeadLetterQueueProcessorService.updateTaskRunsRetry(taskRequest.id, taskRequest.retryCount + 1);
        const newTaskRun = await this.taskRunDeadLetterQueueProcessorService.createNewTaskRun(taskRequest.id);
        this.messageProducerService.emitTaskRunCreated(newTaskRun.id)
      } else {
        await this.taskRunDeadLetterQueueProcessorService.updateTaskStateToFailed(taskRequest.id);
      }
    } catch (error) {
      console.error('Error processing task run error', error);
      // Handle the error appropriately, e.g., log it, send a notification, etc.
    }
    channel.ack(originalMsg);
  }
}
