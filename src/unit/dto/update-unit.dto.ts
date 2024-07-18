import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateConfigDto } from './create-unit.dto';

export class UpdateUnitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(1, { each: true })
  zoneIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  config?: UpdateConfigDto;
}

export class AddZoneToUnitDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  zoneId: number;
}
