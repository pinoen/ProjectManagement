import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({ example: 'NestJS migration', description: 'Proyect name' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 1,
    description: 'Assigned client id (optional)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @ApiProperty({
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
    description: 'Project initial state',
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ example: '2026-12-31', description: 'Project deadline (ISO date)', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}