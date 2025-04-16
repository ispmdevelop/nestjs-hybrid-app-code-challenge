import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { environmentValidation } from './config/environments';
import { TaskModule } from './task/task.module';
import { TaskEventLoggerModule } from './microservice/task-event-logger/task-event-logger.module';
import { TaskRunDeadLetterQueueProcessorModule } from './microservice/task-run-dead-letter-queue-processor/task-run-dead-letter-queue-processor.module';
import { TaskRunProcessorModule } from './microservice/task-run-processor/task-run-processor.module';
import { LibModule } from './lib/lib.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentValidation],
    }),
    DbModule,
    TaskModule,
    TaskEventLoggerModule,
    TaskRunDeadLetterQueueProcessorModule,
    TaskRunProcessorModule,
    LibModule,
  ],
  providers: [AppService],
})
export class AppModule { }
