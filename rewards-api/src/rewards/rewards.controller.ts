import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Query, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RedeemDto } from './dtos/redeem.dto';
import { 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Rewards API')
@Controller('rewards')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Get('points')
  getPoints(@Query('userId') uid: string) {
    return this.service.getPoints(uid);
  }

  @Get('transactions')
  getTxns(@Query('userId') uid: string, @Query('page') page = 1) {
    return this.service.getTransactions(uid, +page);
  }

  @Get('options')
  getOptions() {
    return this.service.getRewardOptions();
  }

  @Post('redeem')
  redeem(@Body() dto: RedeemDto) {
    return this.service.redeemPoints(dto);
  }

  @Get('analytics/rewards-distribution')
  analytics() {
    return this.service.getRewardDistribution();
  }
}

  