import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string) {
    return this.dashboardService.getSummary(userId);
  }
}
