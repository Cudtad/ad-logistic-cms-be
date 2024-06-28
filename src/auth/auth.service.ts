import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { UsersService } from 'src/users/users.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
    private readonly userService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.hashService.doesPasswordMatch(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const lastLoggedIn = new Date();

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoggedIn },
    });

    user.lastLoggedIn = lastLoggedIn;

    const ability = this.caslAbilityFactory.createForUser(user);
    const rules = ability.rules.map(({ subject, action }) => ({
      subject,
      action,
    }));
    return {
      user: { ...this.userService.getUserDetail(user), rules },
      accessToken: this.generateAccessToken({
        id: user.id,
      }),
    };
  }

  validateUser(userId: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prismaService.user.findUnique({ where: { id } });
  }

  private generateAccessToken(payload: { id: number }): string {
    return this.jwtService.sign(payload);
  }

  public async changePassword(user: User, data: ChangePasswordDto) {
    const passwordValid = await this.hashService.doesPasswordMatch(
      data.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const password = await this.hashService.hashPassword(data.newPassword);

    return this.prismaService.user.update({
      where: { id: user.id },
      data: { password },
    });
  }
}
