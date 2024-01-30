import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [FriendsService, PrismaService],
  controllers: [FriendsController],
  imports: [UsersModule]
})
export class FriendsModule {}
