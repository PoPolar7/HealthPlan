import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalModule } from 'src/Goal/Goal.module';
import { BodyInfoModule } from './body-info/body-info.module';
import { RoutineModule } from './routine/routine.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://0923kth:1234@cluster0.rayruhi.mongodb.net/healthdb?retryWrites=true&w=majority',
    ),

    GoalModule,
    BodyInfoModule,
    RoutineModule,
    DashboardModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
