import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BodyInfoDocument = BodyInfo & Document;

@Schema()
export class BodyInfo {
  @Prop({ required: true })
  userId: string; // ✅ email → userId 로 수정하여 Goal과 구조 통일

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop()
  bodyFat: number;

  @Prop()
  muscleMass: number;
}

export const BodyInfoSchema = SchemaFactory.createForClass(BodyInfo);
