import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from './rewards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reward } from './schemas/reward.schema';
import { Transaction } from './schemas/transaction.schema';
import { Redemption } from './schemas/redemption.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RedeemDto } from './dtos/redeem.dto';

const mockRewardModel = {
  findOne: jest.fn(),
  save: jest.fn()
};

const mockTransactionModel = {
  find: jest.fn()
};

const mockRedemptionModel = {
  create: jest.fn(),
  aggregate: jest.fn()
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn()
};

describe('RewardsService', () => {
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getModelToken(Reward.name), useValue: mockRewardModel },
        { provide: getModelToken(Transaction.name), useValue: mockTransactionModel },
        { provide: getModelToken(Redemption.name), useValue: mockRedemptionModel },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return totalPoints for a valid user', async () => {
    mockRewardModel.findOne.mockResolvedValue({ totalPoints: 150 });
    const result = await service.getPoints('user123');
    expect(result.totalPoints).toBe(150);
  });

  it('should throw NotFoundException if user not found in getPoints', async () => {
    mockRewardModel.findOne.mockResolvedValue(null);
    await expect(service.getPoints('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should return last 5 transactions', async () => {
    const mockTxns = Array(5).fill({});
    mockTransactionModel.find.mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => mockTxns
        })
      })
    });
    const result = await service.getTransactions('user123', 1);
    expect(result).toEqual(mockTxns);
  });

  it('should return cached reward options if available', async () => {
    mockCacheManager.get.mockResolvedValue(['cached-option']);
    const result = await service.getRewardOptions();
    expect(result).toEqual(['cached-option']);
  });

  it('should set cache and return options if not cached', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    const result = await service.getRewardOptions();
    expect(mockCacheManager.set).toHaveBeenCalled();
    expect(result).toEqual(['cashback', 'voucher']);
  });

  it('should throw BadRequestException for insufficient points in redeem', async () => {
    const dto: RedeemDto = { userId: 'user1', points: 300, rewardType: 'cashback' };
    mockRewardModel.findOne.mockResolvedValue({ userId: 'user1', totalPoints: 100 });
    await expect(service.redeemPoints(dto)).rejects.toThrow(BadRequestException);
  });

  it('should redeem points and create redemption record', async () => {
    const dto: RedeemDto = { userId: 'user1', points: 100, rewardType: 'cashback' };
    const mockReward = { totalPoints: 200, save: jest.fn() };
    mockRewardModel.findOne.mockResolvedValue(mockReward);
    mockRedemptionModel.create.mockResolvedValue({});

    const result = await service.redeemPoints(dto);
    expect(mockReward.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Redeemed successfully' });
  });

  it('should return reward distribution', async () => {
    const aggResult = [ { rewardType: 'voucher', count: 5 } ];
    mockRedemptionModel.aggregate.mockResolvedValue(aggResult);
    const result = await service.getRewardDistribution();
    expect(result).toEqual(aggResult);
  });
});
