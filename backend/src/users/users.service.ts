import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt'; // ✅ 추가!

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ 비밀번호 해싱 추가!
    const createdUser = new this.userModel({ email, password: hashedPassword });
    return createdUser.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updatePassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.updateOne({ email }, { password: newPassword });
  }

  async updateRefreshToken(email: string, refreshToken: string) {
    return this.userModel.updateOne({ email }, { refreshToken });
  }

  async deleteByEmail(email: string) {
    return this.userModel.deleteOne({ email });
  }
}
