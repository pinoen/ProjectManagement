import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto)
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    await this.userRepository.save(user)

    return user
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`)
    }
    return user
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } })

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    const updatedUser = Object.assign(user, updateUserDto)
    await this.userRepository.save(updatedUser)
    return updatedUser
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    user.status = UserStatus.INACTIVE
    await this.userRepository.save(user)

    return user
  }
}
