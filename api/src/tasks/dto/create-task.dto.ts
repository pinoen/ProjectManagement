import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { TaskStatus } from "../entities/task.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({ example: 'Configurar servidor Nginx', description: 'Descripción de la tarea' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 1, description: 'ID del proyecto al que pertenece la tarea' })
  @IsNumber()
  projectId!: number;

  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE,
    description: 'Estado inicial de la tarea',
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: '2026-12-31', description: 'Fecha límite de la tarea (ISO date)', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}