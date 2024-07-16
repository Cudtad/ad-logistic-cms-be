import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnitService } from './unit.service';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from 'src/auth/type/policies';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/auth/policies.guard';
import { Action } from 'src/casl/casl.constants';
import { ListUnitsQueryDto } from './dto/unit-query.dto';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('unit')
@ApiTags('Unit')
@UseGuards(JwtAuthGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Unit'))
  async findAll(@Query() query: ListUnitsQueryDto) {
    return this.unitService.findAll(query);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Unit'))
  async create(@Body() data: CreateUnitDto) {
    return this.unitService.create(data);
  }
}
