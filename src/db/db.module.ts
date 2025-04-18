
import { Module, Global } from '@nestjs/common';
import { DBService } from './db.service';

@Global()
@Module({
  providers: [DBService],
  exports: [DBService],
})

export class DbModule { }
