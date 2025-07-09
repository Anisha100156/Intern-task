import { Module } from '@nestjs/common';
import { RewardsGateway } from './rewards.gateway';

@Module({
  // Register the gateway for WebSocket handling
  providers: [
    RewardsGateway,
    // Future providers (e.g., AuthGatewayGuard) can be added here
  ],
  exports: [
    RewardsGateway, // Exported for injection into other modules
  ],
})
export class RewardsGatewayModule {
  // Placeholder for lifecycle hooks if needed later
  // onModuleInit() {
  //   console.log('RewardsGatewayModule initialized');
  // }
}
