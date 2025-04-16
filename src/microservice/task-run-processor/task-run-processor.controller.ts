import { Controller } from '@nestjs/common';
import { TaskRunProcessorService } from './task-run-processor.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProcessJobRunDto } from './dto/process-job-run.dto';
import { RunStatus } from '@prisma/client'

const minutesInMilliseconds = 60 * 1000;
const minDelayInMins = 1;
const maxDelayInMins = 2;

@Controller()
export class TaskRunProcessorController {
  constructor(
    private readonly taskRunProcessorService: TaskRunProcessorService,
  ) { }


  @MessagePattern('task.run.created')
  async processJobRun(@Payload() data: ProcessJobRunDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.taskRunProcessorService.changeTaskRunStatus(data.taskRunId, RunStatus.PROCESSING);
      const artificialDelay = Math.floor(Math.random() * (maxDelayInMins - minDelayInMins + 1) + minDelayInMins) * minutesInMilliseconds;
      console.log(`artificialDelay: ${artificialDelay}`);
      await new Promise(resolve => setTimeout(resolve, artificialDelay));
      const randomFailure = Math.random() < 0.5;
      if (randomFailure) {
        throw new Error('artificial failure');
      }
      await this.taskRunProcessorService.changeTaskRunStatus(data.taskRunId, RunStatus.COMPLETED);
    } catch (error) {
      await this.taskRunProcessorService.changeTaskRunStatus(data.taskRunId, RunStatus.FAILED, { error, stack: error.stack });
      this.taskRunProcessorService.sentMessageToDQL(data.taskRunId)
    } finally {
      channel.ack(originalMsg);
    }
  }
}
