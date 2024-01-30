import { Module } from '@nestjs/common';
import { LeadersService } from './leaders.service';
import { LeadersController } from './leaders.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [LeadersService, PrismaService],
  controllers: [LeadersController]
})
export class LeadersModule {}
