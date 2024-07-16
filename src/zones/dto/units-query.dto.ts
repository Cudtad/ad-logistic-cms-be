import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListZonesQueryDto extends PaginationQueryDto {
  allowSortFields = ['name', 'name', 'createdAt', 'updatedAt'];
}
