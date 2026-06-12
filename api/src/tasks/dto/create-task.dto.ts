import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { TaskStatus } from "../entities/task.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({ example: 'Nginx server configuration', description: 'Task description' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 1, description: 'Project id to which the task belongs' })
  @IsNumber()
  projectId!: number;

  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE,
    description: 'Task initial state',
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: '2026-12-31', description: 'Task deadline (ISO date)', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}