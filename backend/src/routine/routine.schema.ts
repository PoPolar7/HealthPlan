import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoutineDocument = Routine & Document;

@Schema({ _id: false })
class Exercise {
  @Prop({ required: true })
  part: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  difficulty: string;

  @Prop({ required: true })
  sets: number;

  @Prop({ required: true })
  reps: number;
}

@Schema({ timestamps: true })
export class Routine {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  day: string;

  @Prop({ required: true, type: [Exercise] })
  exercises: Exercise[];
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);

// ✅ 유니크 인덱스 추가: 같은 요일에 중복 저장 방지
RoutineSchema.index({ userId: 1, day: 1 }, { unique: true });
