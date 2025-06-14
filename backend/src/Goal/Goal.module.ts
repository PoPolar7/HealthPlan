import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalService } from './Goal.service';
import { CatsController } from './Goal.controller';  // 필요시 GoalController로 이름 정리
import { Goal, GoalSchema } from './Goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],
  controllers: [CatsController],
  providers: [GoalService],
  exports: [GoalService], // ✅ 이 줄이 핵심!
})
export class GoalModule {}
