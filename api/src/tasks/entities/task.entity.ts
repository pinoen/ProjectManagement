import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, AfterLoad } from "typeorm";
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

  @ManyToOne(() => Project, project => project.tasks)
  project!: Project

  @Column({ type: 'date', nullable: true })
  deadline?: Date

  remainingDays?: number | null

  @AfterLoad()
  computeRemainingDays() {
    if (this.deadline) {
      const now = new Date();
      const diff = new Date(this.deadline).getTime() - now.getTime();
      this.remainingDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    } else {
      this.remainingDays = null;
    }
  }
}
