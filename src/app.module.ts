import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalModule } from './Goal/Goal.module';
import { BodyInfoModule } from './body-info/body-info/body-info.module';
import { RoutineModule } from './routine/routine.module'; // ✅ 필요한 모듈만 import
import { DashboardModule } from './dashboard/dashboard.module'; // ✅ 추가

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ 추가
    MongooseModule.forRoot('mongodb://localhost:27017/nestmongodb'),
    GoalModule,
    BodyInfoModule,
    RoutineModule,
    DashboardModule,
   
  ],
})
export class AppModule {}
