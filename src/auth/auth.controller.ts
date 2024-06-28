import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ChangePasswordDto, LoginDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserAuthRequest } from 'src/common/types/request.type';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ) {
    const { accessToken, user } = await this.authService.login(
      body.email,
      body.password,
    );

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return {
      user,
      accessToken,
    };
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access-token');
    return {
      message: 'success',
    };
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: UserAuthRequest,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.changePassword(req.user, body);
    return this.logout(res);
  }
}
