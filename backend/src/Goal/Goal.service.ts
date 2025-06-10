import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './Goal.schema';
import { Model } from 'mongoose';

@Injectable()
export class GoalService {
  constructor(
    @InjectModel(Goal.name)
    private readonly goalModel: Model<GoalDocument>,
  ) {}

  async create(data: Partial<Goal>): Promise<Goal> {
    return this.goalModel.create(data);
  }

  async findByUserId(userId: string): Promise<Goal | null> {
    return this.goalModel.findOne({ userId }).exec();
  }

  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
  }
}
