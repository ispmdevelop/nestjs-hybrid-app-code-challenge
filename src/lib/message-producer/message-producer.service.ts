import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessageProducerService {
  constructor(
    @Inject('MQTT_CLIENT') private mqttClient: ClientProxy,
  ) { }

  emitTaskRunCreated(taskRunId: string) {
    return this.mqttClient.emit('task.run.created', { taskRunId })
  }

  emitTaskRunEventPublish(taskRunId: string, details: any) {
    return this.mqttClient.emit('task.run.event.publish', { taskRunId, details: JSON.stringify(details) })
  }

  emitTaskRunError(taskRunId: string) {
    return this.mqttClient.emit('task.run.error', { taskRunId })
  }
}
