//completed_exercise.schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompletedExerciseDocument = CompletedExercise & Document;

@Schema({ timestamps: true })
export class CompletedExercise {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  part: string;

  @Prop()
  sets: number;

  @Prop()
  reps: number;

  @Prop()
  date: string; // ex) '2025-06-04'

  @Prop()
  weightDelta: number; // 체중 변화량

  @Prop()
  muscleDelta: number; // 근육량 변화량

  @Prop()
  routineSuccess: boolean; // 루틴 완료 여부
}

export const CompletedExerciseSchema = SchemaFactory.createForClass(CompletedExercise);
