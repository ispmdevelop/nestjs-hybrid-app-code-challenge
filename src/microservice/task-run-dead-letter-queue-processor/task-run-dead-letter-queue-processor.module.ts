import { Module } from '@nestjs/common';
import { TaskRunDeadLetterQueueProcessorService } from './task-run-dead-letter-queue-processor.service';
import { TaskRunDeadLetterQueueProcessorController } from './task-run-dead-letter-queue-processor.controller';

@Module({
  controllers: [TaskRunDeadLetterQueueProcessorController],
  providers: [TaskRunDeadLetterQueueProcessorService],
})
export class TaskRunDeadLetterQueueProcessorModule {}
