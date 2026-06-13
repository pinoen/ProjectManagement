import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository, ILike, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
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
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', search, status, projectId, dueBefore, dueAfter } = query;

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

    if (dueBefore && dueAfter) {
      where.deadline = Between(new Date(dueAfter), new Date(dueBefore));
    } else if (dueBefore) {
      where.deadline = LessThanOrEqual(new Date(dueBefore));
    } else if (dueAfter) {
      where.deadline = MoreThanOrEqual(new Date(dueAfter));
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

  async exportCsv(): Promise<Buffer> {
    const tasks = await this.taskRepository.find({ order: { id: 'ASC' }, relations: ['project'] });

    const header = toCsvRow(['ID', 'Descripcion', 'Estado', 'Proyecto', 'FechaLimite', 'DiasRestantes']);
    const rows = tasks.map(t => toCsvRow([t.id, t.description, t.status, t.project?.name ?? '', t.deadline ?? '', t.remainingDays ?? '']));
    return Buffer.from('\uFEFF' + header + rows.join(''), 'utf-8');
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['project'] })

    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada.`)
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
