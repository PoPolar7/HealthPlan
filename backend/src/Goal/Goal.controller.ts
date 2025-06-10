import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GoalService } from './Goal.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly GoalService: GoalService) {}

  @Post()
  async create(@Body() createCatDto: any) {
    return this.GoalService.create(createCatDto);
  }

  @Get()
  async findAll() {
    return this.GoalService.findAll();
  }
  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.GoalService.findByUserId(userId);
  }
}
