import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateConfigDto {
  @ApiProperty({
    default: 700,
  })
  @IsInt()
  orderProcessFee: number;

  @ApiProperty({
    default: 0.015,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  accountRentFee: number;
}

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt({
    each: true,
  })
  @Min(1, { each: true })
  zoneIds: number[];

  @ApiProperty()
  @ValidateNested()
  config: UpdateConfigDto;
}
