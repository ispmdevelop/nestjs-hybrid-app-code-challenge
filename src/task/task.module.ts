import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { RunModule } from './run/run.module';
import { RunEventModule } from './run-event/run-event.module';

@Module({
  imports: [RequestModule, RunModule, RunEventModule]
})
export class TaskModule { }
