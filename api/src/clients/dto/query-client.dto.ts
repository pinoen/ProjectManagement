import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn } from 'class-validator';
import { ClientStatus } from '../entities/client.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const CLIENT_SORT_FIELDS = ['id', 'name', 'status'] as const;

export class QueryClientDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ enum: CLIENT_SORT_FIELDS })
  @IsOptional()
  @IsIn(CLIENT_SORT_FIELDS)
  sortBy?: string = 'id';
}
