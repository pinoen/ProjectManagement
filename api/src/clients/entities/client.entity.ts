import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum ClientStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Baja',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.ACTIVE })
  status!: ClientStatus;

  @OneToMany(() => Project, project => project.client)
  projects!: Project[]
}
