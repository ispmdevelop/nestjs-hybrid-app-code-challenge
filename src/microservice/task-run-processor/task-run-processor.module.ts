import { Module } from '@nestjs/common';
import { TaskRunProcessorService } from './task-run-processor.service';
import { TaskRunProcessorController } from './task-run-processor.controller';

@Module({
  controllers: [TaskRunProcessorController],
  providers: [TaskRunProcessorService],
})
export class TaskRunProcessorModule { }
