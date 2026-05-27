import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) { }
  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({ ...createTaskDto, project: { id: createTaskDto.projectId } })

    await this.taskRepository.save(task)
    return task;
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['project'] })

    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found.`)
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id)
    const { projectId, ...restOfUpdate } = updateTaskDto;
    Object.assign(task, restOfUpdate)

    if (projectId) {
      task.project = { id: projectId } as Project
    }

    await this.taskRepository.save(task)
    return task;
  }

  async remove(id: number) {
    const task = await this.findOne(id)
    await this.taskRepository.remove(task)
    return task;
  }
}
