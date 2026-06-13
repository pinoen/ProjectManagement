import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../app.constants";

import { Task } from "./tareas/tareas-api-client";

export interface Client {
  id: number;
  name: string;
  status: 'Activo' | 'Baja';
}

export interface Project {
  id: number;
  name: string;
  status: 'Activo' | 'Finalizado' | 'Baja';
  client?: Client;
  tasks?: Task[];
}

@Injectable({ providedIn: 'root' })
export class ProyectosApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(): Observable<Project[]> {
    return this.client.get<Project[]>(`${API_URL}/projects`);
  }

  findOne(id: number): Observable<Project> {
    return this.client.get<Project>(`${API_URL}/projects/${id}`);
  }

  create(project: { name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja' }): Observable<Project> {
    return this.client.post<Project>(`${API_URL}/projects`, project);
  }

  update(id: number, project: { name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja' }): Observable<Project> {
    return this.client.patch<Project>(`${API_URL}/projects/${id}`, project);
  }

  remove(id: number): Observable<Project> {
    return this.client.delete<Project>(`${API_URL}/projects/${id}`);
  }
}
