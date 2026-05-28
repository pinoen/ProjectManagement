import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) { }
  async create(createProjectDto: CreateProjectDto) {
    const { userId, clientId, ...restOfCreate } = createProjectDto
    const project = this.projectRepository.create({ ...restOfCreate, user: { id: userId } })

    if (clientId) {
      project.client = { id: clientId } as Client
    }

    await this.projectRepository.save(project)
    return project;
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['user'] })

    if (!project) {
      throw new NotFoundException(`Project with id ${id} was not found.`)
    }
    return project
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    const { userId, ...restOfUpdate } = updateProjectDto;
    Object.assign(project, restOfUpdate);

    if (userId) {
      project.user = { id: userId } as User;
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
