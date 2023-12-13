import { Module } from '@nestjs/common';
import { SubController } from './sub.controller';
import { SubService } from './sub.service';

@Module({
  controllers: [SubController],
  providers: [SubService],
})
export class SubModule {}
