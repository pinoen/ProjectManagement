import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { initialData } from './data/seed-data';
import { Client, ClientStatus } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) { }

  async runSeed() {
    // 0. Check database for existing users
    const existingUsers = await this.usersService.findAll();

    if (existingUsers.length > 0) {
      return { message: 'Database is already seeded. No action taken! 🛑' };
    }

    // 1. Seed Users
    for (const user of initialData.users) {
      await this.usersService.create(user);
    }

    // 2. Seed Clients & Save their real DB IDs
    const createdClients: Client[] = [];
    for (const client of initialData.clients) {
      const newClient = await this.clientsService.create(client);
      createdClients.push(newClient);
    }

    // Filter to only active clients to avoid triggering our BadRequestException!
    const activeClients = createdClients.filter(c => c.status === ClientStatus.ACTIVE);

    // 3. Seed Projects
    const createdProjects: Project[] = [];
    for (const project of initialData.projects) {
      // 25% chance of being an internal project (no client)
      const isInternal = Math.random() > 0.75;

      // Grab a random active client
      const randomClient = activeClients[Math.floor(Math.random() * activeClients.length)];

      const newProject = await this.projectsService.create({
        ...project,
        clientId: isInternal ? undefined : randomClient.id // Safe linking!
      });

      createdProjects.push(newProject);
    }

    // 4. Seed Tasks
    for (const task of initialData.tasks) {
      // Grab a random created project
      const randomProject = createdProjects[Math.floor(Math.random() * createdProjects.length)];

      await this.tasksService.create({
        ...task,
        projectId: randomProject.id // Safe linking!
      });
    }

    return { message: 'Database seeded successfully! 🌱' };
  }
}