import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
