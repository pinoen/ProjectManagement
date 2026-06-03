import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from '../users/users.module';
import { ClientsModule } from '../clients/clients.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [UsersModule, ClientsModule, ProjectsModule, TasksModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }
