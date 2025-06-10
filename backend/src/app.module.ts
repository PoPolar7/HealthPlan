import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalModule } from 'src/Goal/Goal.module';
import { BodyInfoModule } from './body-info/body-info.module';
import { RoutineModule } from './routine/routine.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // 환경 변수 로딩
    ConfigModule.forRoot({
      isGlobal: true, // 전체 모듈에서 사용 가능
    }),
    // MongoDB 연결 (환경 변수 MONGODB_URI 우선)
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://0923kth:1234@cluster0.rayruhi.mongodb.net/healthdb?retryWrites=true&w=majority',
    ),

    // Feature 모듈
    GoalModule,
    BodyInfoModule,
    RoutineModule,
    DashboardModule,
  ],
})
export class AppModule {}
