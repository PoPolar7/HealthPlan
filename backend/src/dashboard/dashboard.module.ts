import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from '../routine/completed-exercise.schema';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BodyInfoModule } from '../body-info/body-info.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
    ]),
    BodyInfoModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
