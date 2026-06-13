import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client, ClientStatus } from './entities/client.entity';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { toCsvRow } from '../common/utils/csv';

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

  async findAll(query: QueryClientDto): Promise<PaginatedResultDto<Client>> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', search, status } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.clientRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  async exportCsv(): Promise<Buffer> {
    const clients = await this.clientRepository.find({ order: { id: 'ASC' } });

    const header = toCsvRow(['ID', 'Nombre', 'Estado']);
    const rows = clients.map(c => toCsvRow([c.id, c.name, c.status]));
    return Buffer.from('\uFEFF' + header + rows.join(''), 'utf-8');
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['projects'] })

    if (!client) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado.`)
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
      throw new BadRequestException(`El cliente con id ${id} no puede eliminarse porque está registrado en uno o más proyectos.`)
    }

    client.status = ClientStatus.INACTIVE
    await this.clientRepository.save(client)

    return client;
  }
}
