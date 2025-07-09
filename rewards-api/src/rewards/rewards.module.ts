import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';

import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

import { Reward, RewardSchema } from './schemas/reward.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';
import { RewardsGateway } from './gateway/rewards.gateway';
import { RewardsGatewayModule } from './gateway/rewards-gateway.module';

// Rewards module encapsulates reward-related logic including schemas, service, and websocket gateway
@Module({
  imports: [
    CacheModule.register({ isGlobal: true }), // Enable global cache (customized for broader access)
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
    RewardsGatewayModule, // Custom gateway module to handle real-time events
  ],
  controllers: [
    RewardsController, // Handles HTTP endpoints
  ],
  providers: [
    RewardsService, // Core business logic for reward management
    RewardsGateway, // WebSocket events broadcast
  ],
  exports: [
    RewardsService, // Exported for potential use in other modules (e.g., AdminModule)
  ],
})
export class RewardsModule {
  // Could include onModuleInit() lifecycle logic here if needed in the future
}
