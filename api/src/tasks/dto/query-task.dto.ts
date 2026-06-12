import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const TASK_SORT_FIELDS = ['id', 'description', 'status'] as const;

export class QueryTaskDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number;

  @ApiPropertyOptional({ enum: TASK_SORT_FIELDS })
  @IsOptional()
  @IsIn(TASK_SORT_FIELDS)
  sortBy?: string = 'id';
}
