import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 'id' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @ApiPropertyOptional({ default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
