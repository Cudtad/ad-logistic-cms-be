import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListUnitsQueryDto extends PaginationQueryDto {
  allowSortFields = ['name', 'createdAt', 'updatedAt'];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  zoneId?: number;
}
