import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name!: string

  @IsNumber()
  userId!: number

  @IsNumber()
  @IsOptional()
  clientId?: number
}
