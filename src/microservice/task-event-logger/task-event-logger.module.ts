import { Module } from '@nestjs/common';
import { TaskEventLoggerService } from './task-event-logger.service';
import { TaskEventLoggerController } from './task-event-logger.controller';

@Module({
  controllers: [TaskEventLoggerController],
  providers: [TaskEventLoggerService],
})
export class TaskEventLoggerModule { }
