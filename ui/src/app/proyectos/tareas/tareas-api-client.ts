import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../../app.constants";
import { Project } from "../proyectos-api-client";

export interface Task {
  id: number;
  description: string;
  status: 'Pendiente' | 'Finalizado' | 'Baja';
  project?: Project;
  projectId?: number;
}

@Injectable({ providedIn: 'root' })
export class TareasApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(): Observable<Task[]> {
    return this.client.get<Task[]>(`${API_URL}/tasks`);
  }

  findOne(id: number): Observable<Task> {
    return this.client.get<Task>(`${API_URL}/tasks/${id}`);
  }

  create(taskData: { description: string; projectId: number; status?: 'Pendiente' | 'Finalizado' | 'Baja' }): Observable<Task> {
    return this.client.post<Task>(`${API_URL}/tasks`, taskData);
  }

  update(id: number, taskData: { description?: string; projectId?: number; status?: 'Pendiente' | 'Finalizado' | 'Baja' }): Observable<Task> {
    return this.client.patch<Task>(`${API_URL}/tasks/${id}`, taskData);
  }

  remove(id: number): Observable<Task> {
    return this.client.delete<Task>(`${API_URL}/tasks/${id}`);
  }
}
