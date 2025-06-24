import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    return this.usersService.create(email, password);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email };

    // Access Token 발급 (1시간짜리)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '1h',
    });

    // Refresh Token 발급 (7일짜리)
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Refresh Token을 DB에 저장
    await this.usersService.updateRefreshToken(email, refreshToken);

    return { accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await this.usersService.updatePassword(email, hashedPassword);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '0923kth6@gmail.com',
        pass: 'tzkqshrkdsxsamrm',
      },
    });

    await transporter.sendMail({
      from: '"관리자" <0923kth6@gmail.com>',
      to: email,
      subject: '임시 비밀번호 안내',
      text: `요청하신 임시 비밀번호는 [${tempPassword}] 입니다.\n로그인 후 꼭 비밀번호를 변경해 주세요.`,
    });

    console.log(`✅ ${email} 주소로 임시 비밀번호 발송 완료`);

    return { message: '임시 비밀번호를 이메일로 발송했습니다.' };
  }

  async refreshAccessToken(email: string, refreshToken: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }

    const payload = { email: user.email };

    // 새 Access Token 재발급
    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '1h',
    });

    return { accessToken: newAccessToken };
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedNewPassword);

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async deleteAccount(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    await this.usersService.deleteByEmail(email);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
