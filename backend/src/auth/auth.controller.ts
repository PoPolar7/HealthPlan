import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: { email: string; password: string }) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('refresh')
  refresh(@Body() body: { email: string; refreshToken: string }) {
    return this.authService.refreshAccessToken(body.email, body.refreshToken);
  }

  // 비밀번호 변경
  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Req() req: Request,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userEmail = (req.user as any).email;
    return this.authService.changePassword(
      userEmail,
      body.currentPassword,
      body.newPassword,
    );
  }

  // 회원탈퇴퇴
  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  deleteAccount(@Req() req: Request) {
    const userEmail = (req.user as any).email;
    return this.authService.deleteAccount(userEmail);
  }
}
