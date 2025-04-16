import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { MessageProducerService } from 'src/lib/message-producer/message-producer.service';
import { TaskStatus } from '@prisma/client'

@Controller('task/request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly messageProducerService: MessageProducerService,
  ) { }


  @ApiOperation({ summary: 'Create a task request' })
  @Post()
  async createTaskRequest(@Body() body: CreateTaskRequestDto) {
    const { request, run } = await this.requestService.createNewRequestAndRun(body);
    this.messageProducerService.emitTaskRunCreated(run.id);
    return { request, run };
  }

  @ApiOperation({ summary: 'Get Processing Tasks' })
  @Get('/processing')
  async getProcessingTaskRequests() {
    return this.requestService.getRequests({ include: { taskRuns: { include: { events: true } } }, where: { status: TaskStatus.PROCESSING }, orderBy: { createdAt: 'desc' } });
  }

  @ApiOperation({ summary: 'Get Completed Tasks' })
  @Get('/completed')
  async getCompletedTaskRequests() {
    return this.requestService.getRequests({ include: { taskRuns: { include: { events: true } } }, where: { status: TaskStatus.COMPLETED }, orderBy: { createdAt: 'desc' } });
  }

  @ApiOperation({ summary: 'Get Pending Tasks' })
  @Get('/pending')
  async getPendingRequests() {
    return this.requestService.getRequests({ include: { taskRuns: { include: { events: true } } }, where: { status: TaskStatus.PENDING }, orderBy: { createdAt: 'desc' } });
  }

  @ApiOperation({ summary: 'Get Failed Tasks' })
  @Get('/failed')
  async getFailedRequests() {
    return this.requestService.getRequests({ include: { taskRuns: { include: { events: true } } }, where: { status: TaskStatus.FAILED }, orderBy: { createdAt: 'desc' } });
  }
}
