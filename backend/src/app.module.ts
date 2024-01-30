import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FriendsController } from './friends/friends.controller';
import { FriendsModule } from './friends/friends.module';
import { AppGateway } from './app/app.gateway';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { LeadersModule } from './leaders/leaders.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({envFilePath: '.env'}), AuthModule, FriendsModule, LeadersModule],
  controllers: [],
  providers: [AppGateway, JwtService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {path: '/auth/login', method: RequestMethod.ALL},
        {path: '/auth/registration', method: RequestMethod.ALL}
      )
      .forRoutes({path: '/*', method: RequestMethod.ALL});
  }
}
