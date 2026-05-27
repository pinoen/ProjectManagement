import { IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name!: string

  @IsNumber()
  userId!: number
}
