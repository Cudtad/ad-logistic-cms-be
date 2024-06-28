import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListUsersQueryDto extends PaginationQueryDto {
  allowSortFields = ['id', 'email', 'name', 'createdAt', 'updatedAt'];
}
