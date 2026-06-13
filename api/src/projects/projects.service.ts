import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository, ILike, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ClientStatus } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { toCsvRow } from '../common/utils/csv';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly clientsService: ClientsService
  ) { }
  async create(createProjectDto: CreateProjectDto) {
    const { clientId, ...restOfCreate } = createProjectDto
    const project = this.projectRepository.create({ ...restOfCreate })

    if (clientId) {
      const client = await this.clientsService.findOne(clientId)

      if (client.status !== ClientStatus.ACTIVE) {
        throw new BadRequestException(`Cannot assign client ${clientId} because they are inactive (Baja).`)
      }
      project.client = client
    }

    await this.projectRepository.save(project)
    return project;
  }

  async findAll(query: QueryProjectDto): Promise<PaginatedResultDto<Project>> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', search, status, clientId, dueBefore, dueAfter } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.client = { id: clientId };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (dueBefore && dueAfter) {
      where.deadline = Between(new Date(dueAfter), new Date(dueBefore));
    } else if (dueBefore) {
      where.deadline = LessThanOrEqual(new Date(dueBefore));
    } else if (dueAfter) {
      where.deadline = MoreThanOrEqual(new Date(dueAfter));
    }

    const [data, total] = await this.projectRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['client', 'tasks'],
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  async exportCsv(): Promise<Buffer> {
    const projects = await this.projectRepository.find({ order: { id: 'ASC' }, relations: ['client'] });

    const header = toCsvRow(['ID', 'Nombre', 'Estado', 'Cliente', 'FechaLimite', 'DiasRestantes']);
    const rows = projects.map(p => toCsvRow([p.id, p.name, p.status, p.client?.name ?? '', p.deadline ?? '', p.remainingDays ?? '']));
    return Buffer.from('\uFEFF' + header + rows.join(''), 'utf-8');
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['client', 'tasks'] })

    if (!project) {
      throw new NotFoundException(`Project with id ${id} was not found.`)
    }
    return project
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    const { clientId, ...restOfUpdate } = updateProjectDto;

    Object.assign(project, restOfUpdate);

    if (clientId) {
      const client = await this.clientsService.findOne(clientId);

      if (client.status !== ClientStatus.ACTIVE) {
        throw new BadRequestException(`Cannot assign client ${clientId} because they are inactive (Baja).`);
      }

      project.client = client;
    }

    await this.projectRepository.save(project);
    return project;
  }

  async remove(id: number) {
    const project = await this.findOne(id)
    await this.projectRepository.remove(project)
    return project;
  }
}
