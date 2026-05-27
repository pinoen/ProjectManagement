import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) { }
  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create({ ...createProjectDto, user: { id: createProjectDto.userId } })

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
