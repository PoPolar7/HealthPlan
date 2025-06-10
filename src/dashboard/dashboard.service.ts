import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompletedExercise, CompletedExerciseDocument } from '../routine/completed-exercise.schema';
import { BodyInfoService } from '../body-info/body-info/body-info.service';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(CompletedExercise.name)
    private readonly completedModel: Model<CompletedExerciseDocument>,
    private readonly bodyInfoService: BodyInfoService,
  ) {}

  async getSummary(userId: string) {
    const effectsPath = path.join(__dirname, '../../data/exercise-effects.json');
    const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf-8'));

    const completed = await this.completedModel.find({ userId });

    let weightTotal = 0;
    let muscleTotal = 0;

    for (const ex of completed) {
  console.log('✅ 처리 중인 운동:', ex.name); // ✅ 추가
  const effect = effects[ex.name];
  if (!effect) {
    console.warn(`⚠️ '${ex.name}' 운동은 exercise-effects.json에 없습니다.`);
    continue;
  }
  weightTotal += effect.weight;
  muscleTotal += effect.muscle;
}


    const bodyInfo = await this.bodyInfoService.findByUserId(userId);
    if (!bodyInfo) throw new Error('사용자 신체 정보가 없습니다');

    const currentWeight = bodyInfo.weight + weightTotal;
    const currentMuscle = (bodyInfo.muscleMass || 0) + muscleTotal;

    return {
      totalExercises: completed.length,
      totalWeightChange: weightTotal,
      totalMuscleChange: muscleTotal,
      startWeight: bodyInfo.weight,
      startMuscle: bodyInfo.muscleMass || 0,
      currentWeight,
      currentMuscle,
    };
  }
}
