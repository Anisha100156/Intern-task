import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {BadRequestException, Inject, Injectable, NotFoundException,Logger} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

import { Reward, RewardDocument } from './schemas/reward.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Redemption, RedemptionDocument } from './schemas/redemption.schema';
import { RedeemDto } from './dtos/redeem.dto';
import { mockUsers } from './mock-users';
import { RewardsGateway } from './gateway/rewards.gateway';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Redemption.name) private redemptionModel: Model<RedemptionDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gateway: RewardsGateway,
  ) {}

  // Validate user existence in the mock dataset
  private validateUser(userId: string) {
    const exists = mockUsers.some(user => user.userId === userId);
    if (!exists) {
      this.logger.warn(`Validation failed: userId '${userId}' not found.`);
      throw new NotFoundException(`User ID "${userId}" not found in mock users`);
    }
  }

  async getPoints(userId: string) {
    this.validateUser(userId);

    let reward = await this.rewardModel.findOne({ userId });
    if (!reward) {
      this.logger.log(`Creating new reward entry for userId: ${userId}`);
      reward = new this.rewardModel({ userId, totalPoints: 0 });
      await reward.save();
    }

    return { totalPoints: reward.totalPoints };
  }

  async getTransactions(userId: string, page = 1) {
    this.validateUser(userId);
    const pageSize = 5;
    this.logger.debug(`Fetching page ${page} of transactions for ${userId}`);

    return this.transactionModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async getRewardOptions() {
    const cacheKey = 'reward-options';
    const cached = await this.cacheManager.get<string[]>(cacheKey);
    if (cached) {
      this.logger.verbose(`Returning cached reward options`);
      return cached;
    }

    const options = ['cashback', 'voucher'];
    this.logger.log(`Caching new reward options`);
    await this.cacheManager.set(cacheKey, options, 3600);
    return options;
  }

  async redeemPoints(dto: RedeemDto) {
    this.validateUser(dto.userId);
    const reward = await this.rewardModel.findOne({ userId: dto.userId });

    if (!reward || reward.totalPoints < dto.points) {
      this.logger.error(`Redemption failed: insufficient points for ${dto.userId}`);
      throw new BadRequestException('Insufficient points');
    }

    reward.totalPoints -= dto.points;
    await reward.save();

    await this.redemptionModel.create({
      userId: dto.userId,
      pointsUsed: dto.points,
      rewardType: dto.rewardType,
      timestamp: new Date(),
    });

    this.logger.log(`Redemption successful for ${dto.userId}, points deducted: ${dto.points}`);
    this.gateway.sendUpdatedPoints(dto.userId, reward.totalPoints);

    return { message: 'Redeemed successfully' };
  }

  async getRewardDistribution() {
    this.logger.debug('Generating reward distribution analytics');
    return this.redemptionModel.aggregate([
      { $group: { _id: '$rewardType', count: { $sum: 1 } } },
      { $project: { rewardType: '$_id', count: 1, _id: 0 } },
    ]);
  }
}
