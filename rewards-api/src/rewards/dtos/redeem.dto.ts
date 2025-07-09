import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO used to validate redemption requests from clients
export class RedeemDto {
  @IsString({ message: 'userId must be a string' })
  userId: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'points must be a number' })
  @Min(1, { message: 'points must be at least 1' })
  points: number;

  @IsString({ message: 'rewardType must be a string' })
  rewardType: string;

  // @IsOptional() // Consider adding optional comments or tags in the future
  // comment?: string;
}
