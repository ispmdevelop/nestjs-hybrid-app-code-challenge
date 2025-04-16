import { Module } from '@nestjs/common';
import { RunEventService } from './run-event.service';

@Module({
  providers: [RunEventService],
  exports: [RunEventService],
})
export class RunEventModule { }
