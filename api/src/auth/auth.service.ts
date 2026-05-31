import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (user)')
    }

    const isPassword = await bcrypt.compare(pass, user.password)

    if (!isPassword) {
      throw new UnauthorizedException('Invalid credentials (password)')
    }

    const payload = { sub: user.id, username: user.username }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
