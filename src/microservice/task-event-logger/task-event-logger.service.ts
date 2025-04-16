import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { ProcessRunEventDto } from './dto/process-run-event.dto';
import { EventType } from '@prisma/client'

@Injectable()
export class TaskEventLoggerService {
  constructor(
    private readonly dbService: DBService,
  ) { }

  createLogEntry(data: ProcessRunEventDto): Promise<any> {
    return this.dbService.taskRunEvent.create({ data: { taskRunId: data.taskRunId, details: data.details, eventType: EventType.STATUS_CHANGED } });
  }
}
