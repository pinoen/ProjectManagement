import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const TASK_SORT_FIELDS = ['id', 'description', 'status', 'deadline'] as const;

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

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Filtrar: fecha límite anterior a esta fecha' })
  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Filtrar: fecha límite posterior a esta fecha' })
  @IsOptional()
  @IsDateString()
  dueAfter?: string;

  @ApiPropertyOptional({ enum: TASK_SORT_FIELDS })
  @IsOptional()
  @IsIn(TASK_SORT_FIELDS)
  sortBy?: string = 'id';
}
