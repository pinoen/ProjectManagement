import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository, ILike } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { toCsvRow } from '../common/utils/csv';

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

  async findAll(query: QueryTaskDto): Promise<PaginatedResultDto<Task>> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', search, status, projectId } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (projectId) {
      where.project = { id: projectId };
    }

    if (search) {
      where.description = ILike(`%${search}%`);
    }

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['project'],
    });

    return new PaginatedResultDto(data, total, page, limit);
  }

  async exportCsv(): Promise<string> {
    const tasks = await this.taskRepository.find({ order: { id: 'ASC' }, relations: ['project'] });

    const header = toCsvRow(['ID', 'Descripcion', 'Estado', 'Proyecto']);
    const rows = tasks.map(t => toCsvRow([t.id, t.description, t.status, t.project?.name ?? '']));
    return '\uFEFF' + header + rows.join('');
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

    task.status = TaskStatus.INACTIVE
    await this.taskRepository.save(task)
    return task;
  }
}
