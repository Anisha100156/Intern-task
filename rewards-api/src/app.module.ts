import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsModule } from './rewards/rewards.module';
// @ts-ignore: No type declarations for cache-manager-ioredis
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    // ✅ Redis-based Cache (global)
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: 60, // 1 minute default TTL
      }),
    }),

    // ✅ MongoDB connection
    MongooseModule.forRoot('mongodb://localhost:27017/rewards'),

    // ✅ Feature Module
    RewardsModule,
  ],
})
export class AppModule {}
