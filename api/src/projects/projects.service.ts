import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ClientStatus } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';

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

  async findAll() {
    return await this.projectRepository.find({ relations: ['client', 'tasks'] });
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
