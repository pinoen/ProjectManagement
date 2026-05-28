import { IsEnum, IsOptional, IsString } from "class-validator";
import { ClientStatus } from "../entities/client.entity";

export class CreateClientDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus
}
