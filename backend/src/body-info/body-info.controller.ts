import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyInfo, BodyInfoDocument } from './body-info.schema';
import { BodyInfoService } from './body-info.service';

@Controller('body-info')
export class BodyInfoController {
  constructor(
    @InjectModel(BodyInfo.name)
    private readonly bodyInfoModel: Model<BodyInfoDocument>,
    private readonly bodyInfoService: BodyInfoService,
  ) {}

  // ✅ 신체 정보 저장 또는 업데이트 (기존 POST 라우터 개선)
  @Post()
  async createOrUpdate(@Body() bodyInfo: BodyInfo): Promise<BodyInfo> {
    const saved = await this.bodyInfoService.saveOrUpdate(bodyInfo);
    console.log('✅ 신체 정보 저장 또는 수정 완료:', saved);
    return saved;
  }

  // ✅ 신체 정보 조회 (프론트가 요청하는 GET 라우터 추가)
  @Get(':email')
  async getByEmail(@Param('email') email: string): Promise<BodyInfo | null> {
    const found = await this.bodyInfoService.findByEmail(email);
    if (!found) {
      console.warn('⚠️ 사용자 정보 없음:', email);
    }
    return found;
  }
}
