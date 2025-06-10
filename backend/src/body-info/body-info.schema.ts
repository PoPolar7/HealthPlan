//body-info.service.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BodyInfoDocument = BodyInfo & Document;

@Schema()
export class BodyInfo {
   @Prop({ required: true }) userId: string; 
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
