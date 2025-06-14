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

  // ✅ 신체 정보 저장 또는 업데이트 (기준: email)
  async saveOrUpdate(data: Partial<BodyInfo>): Promise<BodyInfo> {
    if (!data.userId) {
      throw new Error('email is required to save or update BodyInfo');
    }

    const existing = await this.bodyInfoModel.findOne({ userId: data.userId });
    if (existing) {
      if (data.height !== undefined) existing.height = data.height;
      if (data.weight !== undefined) existing.weight = data.weight;
      if (data.bodyFat !== undefined) existing.bodyFat = data.bodyFat;
      if (data.muscleMass !== undefined) existing.muscleMass = data.muscleMass;
      return existing.save();
    } else {
      return this.bodyInfoModel.create(data);
    }
  }

  // ✅ 이메일로 사용자 정보 조회
  async findByEmail(email: string): Promise<BodyInfo | null> {
    return this.bodyInfoModel.findOne({ userId:email }).exec();
  }
}