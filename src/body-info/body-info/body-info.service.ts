//body-info.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyInfo, BodyInfoDocument } from './body-info.schema';

@Injectable()
export class BodyInfoService {
  constructor(
    @InjectModel(BodyInfo.name)
    private readonly bodyInfoModel: Model<BodyInfoDocument>,
  ) {}

  // 신체 정보 저장
  async create(data: Partial<BodyInfo>): Promise<BodyInfo> {
    return this.bodyInfoModel.create(data);
  }

  // userId로 사용자 정보 조회 (루틴 추천용)
  async findByUserId(userId: string): Promise<BodyInfo | null> {
    return this.bodyInfoModel.findOne({ userId }).exec();
  }
}
