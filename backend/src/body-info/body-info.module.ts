import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BodyInfo, BodyInfoSchema } from './body-info.schema';
import { BodyInfoController } from './body-info.controller';
import { BodyInfoService } from './body-info.service';
import { GoalModule } from 'src/Goal/Goal.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BodyInfo.name, schema: BodyInfoSchema },
    ]),
    GoalModule,
  ],
  controllers: [BodyInfoController],
  providers: [BodyInfoService],
  exports: [BodyInfoService],
})
export class BodyInfoModule {}
