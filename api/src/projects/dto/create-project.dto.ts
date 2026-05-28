import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";

export class CreateProjectDto {
  @IsString()
  name!: string

  @IsNumber()
  userId!: number

  @IsNumber()
  @IsOptional()
  clientId?: number

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus
}
