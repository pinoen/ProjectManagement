import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../entities/task.entity";

export class CreateTaskDto {
  @IsString()
  description!: string

  @IsNumber()
  projectId!: number

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus
}
