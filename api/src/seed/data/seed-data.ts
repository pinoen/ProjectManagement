import { ClientStatus } from '../../clients/entities/client.entity';
import { ProjectStatus } from '../../projects/entities/project.entity';
import { TaskStatus } from '../../tasks/entities/task.entity';
import { UserStatus } from '../../users/entities/user.entity';

interface SeedUser {
  username: string;
  password: string;
  status: UserStatus;
}

interface SeedClient {
  name: string;
  status: ClientStatus;
}

interface SeedProject {
  name: string;
  status: ProjectStatus;
}

interface SeedTask {
  description: string;
  status: TaskStatus;
}

interface SeedData {
  users: SeedUser[];
  clients: SeedClient[];
  projects: SeedProject[];
  tasks: SeedTask[];
}

export const initialData: SeedData = {
  users: [
    { username: 'admin', password: 'password123', status: UserStatus.ACTIVE },
    { username: 'test_user', password: 'password123', status: UserStatus.ACTIVE },
    { username: 'old_dev', password: 'password123', status: UserStatus.INACTIVE },
  ],
  clients: [
    { name: 'Zorzal Sistemas', status: ClientStatus.ACTIVE },
    { name: 'Gaucho Tech', status: ClientStatus.ACTIVE },
    { name: 'Litoral Cloud', status: ClientStatus.INACTIVE },
    { name: 'Patagonia Devs', status: ClientStatus.ACTIVE },
  ],
  projects: [
    { name: 'Migración a NestJS', status: ProjectStatus.ACTIVE },
    { name: 'Portal de Leyendas', status: ProjectStatus.FINISHED },
    { name: 'API de Gestión', status: ProjectStatus.ACTIVE },
    { name: 'Proyecto Interno (Sin Cliente)', status: ProjectStatus.ACTIVE },
  ],
  tasks: [
    { description: 'Configurar servidor Nginx', status: TaskStatus.PENDIENTE },
    { description: 'Diseñar base de datos PostgreSQL', status: TaskStatus.FINISHED },
    { description: 'Implementar JWT Guard', status: TaskStatus.FINISHED },
    { description: 'Crear endpoints de clientes', status: TaskStatus.PENDIENTE },
    { description: 'Testear despliegue con PM2', status: TaskStatus.PENDIENTE },
  ]
};