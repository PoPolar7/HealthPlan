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


  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
    
  }
   async findByEmail(email: string): Promise<Goal | null> {
    return this.goalModel.findOne({ userId: email }).exec(); // 🟢 userId에 이메일이 들어 있음
  }
  
}
