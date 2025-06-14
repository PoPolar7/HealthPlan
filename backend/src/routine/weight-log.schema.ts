import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeightLogDocument = WeightLog & Document;

@Schema()
export class WeightLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true })
  weight: number;
}

export const WeightLogSchema = SchemaFactory.createForClass(WeightLog);
