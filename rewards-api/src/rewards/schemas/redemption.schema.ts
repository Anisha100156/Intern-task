import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RedemptionDocument = HydratedDocument<Redemption>;

@Schema()
export class Redemption {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  pointsUsed: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption);
