import { Controller, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyInfo, BodyInfoDocument } from './body-info.schema';
import { BodyInfoService } from './body-info.service';

@Controller('body-info')
export class BodyInfoController {
  constructor(
    @InjectModel(BodyInfo.name)
    private readonly bodyInfoModel: Model<BodyInfoDocument>,
    private readonly bodyInfoService: BodyInfoService
  ) {}

  @Post()
  async create(@Body() bodyInfo: BodyInfo): Promise<BodyInfo> {
    const created = new this.bodyInfoModel(bodyInfo);
    const saved = await created.save();
    console.log('✅ 신체 정보 저장 완료:', saved);
    return saved;
  }
}
