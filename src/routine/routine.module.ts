import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { GoalModule } from '../Goal/Goal.module';
import { BodyInfoModule } from '../body-info/body-info/body-info.module';
import { Routine, RoutineSchema } from './routine.schema';
import { CompletedExercise, CompletedExerciseSchema } from './completed-exercise.schema'; // ✅ 추가
import { WeightLog, WeightLogSchema } from './weight-log.schema';
@Module({
  imports: [
    GoalModule,
    BodyInfoModule,
    MongooseModule.forFeature([
      { name: Routine.name, schema: RoutineSchema },
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
      { name: WeightLog.name, schema: WeightLogSchema }, // ✅ 추가 // ✅ 추가
    ]),
  ],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
