import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, AfterLoad } from "typeorm";
import { Client } from "../../clients/entities/client.entity";
import { Task } from "../../tasks/entities/task.entity";

export enum ProjectStatus {
  ACTIVE = 'Activo',
  FINISHED = 'Finalizado',
  INACTIVE = 'Baja',
}

@Entity('projects')
export class Project {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status!: ProjectStatus

  @ManyToOne(() => Client, { nullable: true })
  client?: Client

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[]

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
