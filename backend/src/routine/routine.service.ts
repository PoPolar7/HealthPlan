//routine.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Routine, RoutineDocument } from './routine.schema';

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine.name)
    private readonly routineModel: Model<RoutineDocument>,
  ) {}

  async generateRoutine(input: any) {
    console.log('🔥 generateRoutine 호출됨:', input); // ← 여기

    const dbPath = path.join(__dirname, '../../data/routines.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const { userId, goal, difficulty, frequency } = input;
    
    const result = { goal, daysPerWeek: frequency, routine: {} };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, frequency);
    const goalMap = {
  'Normal': '근육 증가',
  'FatLoss': '체지방 감량',
  'Endurance': '체력 강화',
};

const source = db[goalMap[goal] || goal];

    let i = 0;

    const selectedLevel = difficulty === 'Easy' ? '하' : difficulty === 'Hard' ? '상' : '중';
    const levelPriorityMap = {
      '하': ['하', '중', '상'],
      '중': ['중', '상'],
      '상': ['상'],
    };
    const levelPriority = levelPriorityMap[selectedLevel];

    console.log('🧹 기존 루틴 삭제 중...');
await this.routineModel.deleteMany({ userId });
console.log('✅ 기존 루틴 삭제 완료');


    for (const part in source) {
      let levelExercises: any[] = [];

      for (const level of levelPriority) {
        const candidate = source[part]?.[level] || [];
        levelExercises.push(...candidate);
        if (levelExercises.length >= 2) break;
      }

      const selected = levelExercises.slice(0, 2);
      const day = days[i % frequency];
      const exercises = selected.map((item) => ({
        part,
        name: item.name,
        difficulty: item.difficulty.trim(),
        sets: item.difficulty.trim() === '상' ? 4 : 3,
        reps: item.difficulty.trim() === '상' ? 8 : 12,
      }));

      // ✅ 생성된 루틴을 MongoDB에 저장
      await this.routineModel.updateOne(
  { userId, day },
  { userId, day, exercises },
  { upsert: true }
);


      result.routine[day] = exercises;
      i++;
    }

    return result;
  }

  async updateDayRoutine(userId: string, day: string, exercises: any[]) {
    return this.routineModel.findOneAndUpdate(
      { userId, day },
      { exercises },
      { new: true, upsert: true },
    );
  }

  async getAllRoutines(userId: string) {
    return this.routineModel.find({ userId });
  }
} 