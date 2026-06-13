import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const PROJECT_SORT_FIELDS = ['id', 'name', 'status', 'deadline'] as const;

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

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Filtrar: fecha límite anterior a esta fecha' })
  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Filtrar: fecha límite posterior a esta fecha' })
  @IsOptional()
  @IsDateString()
  dueAfter?: string;

  @ApiPropertyOptional({ enum: PROJECT_SORT_FIELDS })
  @IsOptional()
  @IsIn(PROJECT_SORT_FIELDS)
  sortBy?: string = 'id';
}
