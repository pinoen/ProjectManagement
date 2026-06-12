import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const PROJECT_SORT_FIELDS = ['id', 'name', 'status'] as const;

export class QueryProjectDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clientId?: number;

  @ApiPropertyOptional({ enum: PROJECT_SORT_FIELDS })
  @IsOptional()
  @IsIn(PROJECT_SORT_FIELDS)
  sortBy?: string = 'id';
}
