import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RunModule } from '../run/run.module';
import { RequestController } from './request.controller';

@Module({
  imports: [RunModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule { }
