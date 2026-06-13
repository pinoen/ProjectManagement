import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserStatus } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'admin_user', description: 'Nombre de usuario único', minLength: 3 })
  @IsString()
  @MinLength(3)
  username!: string

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario (será encriptada)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    description: 'Estado inicial del usuario',
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}
