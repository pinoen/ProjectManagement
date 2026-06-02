import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientStatus } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }
  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto)
    await this.clientRepository.save(client)
    return client;
  }

  async findAll() {
    return await this.clientRepository.find()
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['projects'] })

    if (!client) {
      throw new NotFoundException(`Client with the id ${id} was not found.`)
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id)
    const updatedClient = Object.assign(client, updateClientDto)

    await this.clientRepository.save(updatedClient)
    return updatedClient;
  }

  async remove(id: number) {
    const client = await this.findOne(id)

    if (client.projects && client.projects.length > 0) {
      throw new BadRequestException(`Client with id ${id} cannot be removed because it is registered in one or more projects.`)
    }

    client.status = ClientStatus.INACTIVE
    await this.clientRepository.save(client)

    return client;
  }
}
