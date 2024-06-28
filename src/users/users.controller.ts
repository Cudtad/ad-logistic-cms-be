import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  UserAbilityRequest,
  UserAuthRequest,
} from 'src/common/types/request.type';
import { PoliciesGuard } from 'src/auth/policies.guard';
import { CheckPolicies } from 'src/auth/type/policies';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/casl.constants';
import { ListUsersQueryDto } from './dto/users-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(PoliciesGuard)
  async getMe(@Req() req: UserAbilityRequest) {
    return {
      ...this.usersService.getUserDetail(req.user),
      rules: req.ability.rules.map(({ subject, action }) => ({
        subject,
        action,
      })),
    };
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'User'))
  async fingAll(
    @Req() req: UserAbilityRequest,
    @Query() query: ListUsersQueryDto,
  ) {
    return this.usersService.findAll(req.user, req.ability, query);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'User'))
  create(@Req() req: UserAbilityRequest, @Body() data: CreateUserDto) {
    return this.usersService.create(req.user, data);
  }

  @Patch('me')
  updateMe(@Req() req: UserAuthRequest, @Body() data: UpdateUserDto) {
    return this.usersService.updateMe(req.user, data);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'User'))
  update(
    @Req() req: UserAbilityRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.update(req.user, id, data);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'User'))
  delete(
    @Req() req: UserAbilityRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.delete(req.user, id);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'User'))
  async findById(
    @Req() req: UserAbilityRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.usersService.findOne(req.user, id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.getUserDetail(user);
  }
}
