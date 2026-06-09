import { IsEnum, IsOptional, IsString } from "class-validator";
import { ClientStatus } from "../entities/client.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateClientDto {
  @ApiProperty({ example: 'Zorzal Sistemas' })
  @IsString()
  name!: string

  @ApiProperty({
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
    description: 'Client initial state',
    required: false
  })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus
}
