import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/auth/policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/auth/type/policies';
import { Action } from 'src/casl/casl.constants';
import { ListZonesQueryDto } from './dto/units-query.dto';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('zones')
@ApiTags('Zones')
@UseGuards(JwtAuthGuard)
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Zone'))
  findAll(@Query() query: ListZonesQueryDto) {
    return this.zonesService.findAll(query);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Zone'))
  create(@Body() data: CreateZoneDto) {
    return this.zonesService.create(data);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Zone'))
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateZoneDto) {
    return this.zonesService.update(id, data);
  }
}
