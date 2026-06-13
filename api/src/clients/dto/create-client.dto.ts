import { IsEnum, IsOptional, IsString } from "class-validator";
import { ClientStatus } from "../entities/client.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateClientDto {
  @ApiProperty({ example: 'Zorzal Sistemas', description: 'Nombre del cliente' })
  @IsString()
  name!: string

  @ApiProperty({
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
    description: 'Estado inicial del cliente',
    required: false
  })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus
}
