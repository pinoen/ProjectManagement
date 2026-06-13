import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({ example: 'Migración a NestJS', description: 'Nombre del proyecto' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 1,
    description: 'ID del cliente asignado (opcional)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @ApiProperty({
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
    description: 'Estado inicial del proyecto',
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ example: '2026-12-31', description: 'Fecha límite del proyecto (ISO date)', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}