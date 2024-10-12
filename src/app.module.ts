import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin.controller';
import { UserController } from './user.controller';
import { AccessKeyService } from './access-key.service';
import Redis from 'ioredis';

@Module({
  imports: [],
  controllers: [AppController, AdminController, UserController],
  providers: [
    AppService,
    AccessKeyService,
    {
      provide: 'REDIS_PUB_CLIENT',
      useFactory: () => {
        return new Redis();
      },
    },
    {
      provide: 'REDIS_SUB_CLIENT',
      useFactory: () => {
        return new Redis();
      },
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis();
      },
    },
  ],
})
export class AppModule {}
