import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { GoalService } from '../Goal/Goal.service';
import { BodyInfoService } from '../body-info/body-info.service';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompletedExercise,
  CompletedExerciseDocument,
} from './completed-exercise.schema';

@Controller('routine')
export class RoutineController {
  constructor(
    private readonly routineService: RoutineService,
    private readonly goalService: GoalService,
    private readonly bodyInfoService: BodyInfoService,
    @InjectModel(CompletedExercise.name)
    private readonly completedModel: Model<CompletedExerciseDocument>,
  ) {}

  @Post()
  async getRoutine(@Body('userId') userId: string) {
    const goal = await this.goalService.findByEmail(userId);
    const body = await this.bodyInfoService.findByEmail(userId);

    if (!goal || !body) {
      throw new NotFoundException(
        '해당 사용자의 목표(goal) 또는 신체 정보(bodyInfo)가 존재하지 않습니다.',
      );
    }

    return this.routineService.generateRoutine({
      userId,
      goal: goal.goal,
      difficulty: goal.difficulty,
      frequency: goal.frequency,
    });
  }

  @Patch(':userId/:day')
  async updateDayRoutine(
    @Param('userId') userId: string,
    @Param('day') day: string,
    @Body('exercises') exercises: any[],
  ) {
    return this.routineService.updateDayRoutine(userId, day, exercises);
  }

  @Get('/exercise-info')
  async getExerciseInfo(
    @Query('name') name: string,
    @Query('part') part?: string,
    @Query('userId') userId?: string,
  ) {
    const dbPath = path.join(__dirname, '../../data/routines.json');
    if (!fs.existsSync(dbPath)) {
      throw new NotFoundException('routines.json 파일을 찾을 수 없습니다.');
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const normalize = (text: string) =>
      decodeURIComponent(text)
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/gi, '')
        .trim()
        .toLowerCase();

    const targetName = normalize(name);
    const targetPart = part ? normalize(part) : null;

    for (const goalKey in db) {
      const parts = db[goalKey];
      for (const partKey in parts) {
        for (const levelKey in parts[partKey]) {
          for (const ex of parts[partKey][levelKey]) {
            const exName = normalize(ex.name);
            const exPart = normalize(partKey);

            const nameMatches = exName === targetName;
            const partMatches = !targetPart || exPart === targetPart;

            if (nameMatches && partMatches) {
              let isCompleted = false;
              if (userId) {
                const count = await this.completedModel.countDocuments({
                  userId,
                  name,
                });
                isCompleted = count > 0;
              }

              return {
                ...ex,
                part: partKey,
                description:
                  ex.description || `${partKey} 운동 설명이 없습니다.`,
                videoUrl: ex.videoUrl || '',
                isCompleted,
              };
            }
          }
        }
      }
    }

    throw new NotFoundException(`${name} 운동을 찾을 수 없습니다.`);
  }

  @Post('/complete')
  async completeExercise(
    @Body() body: { userId: string; name: string; date: string },
  ) {
    const entry = new this.completedModel(body);
    await entry.save();
    return { success: true };
  }

  @Get('/completed/:userId')
  async getCompleted(@Param('userId') userId: string) {
    return this.completedModel.find({ userId }).exec();
  }

  @Get('/exercise-list/:goal/:part/:level')
  async getExerciseList(
    @Param('goal') goal: string,
    @Param('part') part: string,
    @Param('level') level: string,
    @Query('userId') userId?: string,
  ) {
    const dbPath = path.join(__dirname, '../../data/routines.json');
    if (!fs.existsSync(dbPath)) {
      throw new NotFoundException('routines.json 파일을 찾을 수 없습니다.');
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const goalMap = {
      Normal: '근육 증가',
      FatLoss: '체지방 감량',
      Endurance: '체력 강화',
    };
    const realGoal = goalMap[goal] || goal;

    const exercises = db[realGoal]?.[part]?.[level] || [];

    let completedNames: string[] = [];

    if (userId) {
      const completedDocs = await this.completedModel
        .find({ userId })
        .select('name');
      completedNames = completedDocs.map((doc) => doc.name);
    }

    return exercises.map((ex) => ({
      ...ex,
      part,
      isCompleted: completedNames.includes(ex.name),
    }));
  }

  @Get(':userId')
  async getAllRoutines(@Param('userId') userId: string) {
    return this.routineService.getAllRoutines(userId);
  }
}
