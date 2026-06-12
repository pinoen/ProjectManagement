import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserStatus } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'admin_user', description: 'The unique username', minLength: 3 })
  @IsString()
  @MinLength(3)
  username!: string

  @ApiProperty({ example: 'password123', description: 'User password (will be hashed)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    description: 'User initial status',
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}
