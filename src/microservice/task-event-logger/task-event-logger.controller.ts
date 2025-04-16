import { Controller } from '@nestjs/common';
import { TaskEventLoggerService } from './task-event-logger.service';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ProcessRunEventDto } from './dto/process-run-event.dto';

@Controller()
export class TaskEventLoggerController {
  constructor(
    private readonly taskEventLoggerService: TaskEventLoggerService,
  ) { }

  @MessagePattern('task.run.event.publish')
  async processJobRun(@Payload() data: ProcessRunEventDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.taskEventLoggerService.createLogEntry(data);
    channel.ack(originalMsg);
  }
}
