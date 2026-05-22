import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../../projects/entities/project.entity";

export enum TaskStatus {
  PENDIENTE = 'Pendiente',
  FINISHED = 'Finalizado',
  INACTIVE = 'Baja',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  description!: string

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDIENTE })
  status!: TaskStatus

  @ManyToOne(() => Project)
  project!: Project
}
