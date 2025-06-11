import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GoalService } from './Goal.service';
import { GoalDocument } from './Goal.schema';

@Controller('goal')
export class CatsController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  async saveOrUpdate(@Body() createGoalDto: any) {
    const existing = await this.goalService.findByEmail(createGoalDto.userId);

    if (existing) {
      const doc = existing as GoalDocument;
      doc.goal = createGoalDto.goal;
      doc.difficulty = createGoalDto.difficulty;
      doc.frequency = createGoalDto.frequency;
      return doc.save(); // ✅ 기존 목표 수정
    }

    return this.goalService.create(createGoalDto); // ✅ 신규 생성
  }

  @Get()
  async findAll() {
    return this.goalService.findAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.goalService.findByEmail(email);
  }
}
