import { HttpClient, HttpParams } from "@angular/common/http";
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
  deadline?: string;
  remainingDays?: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProyectosApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(query?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC'; search?: string; status?: string; clientId?: number }): Observable<PaginatedResult<Project>> {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(key => {
        const val = (query as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.client.get<PaginatedResult<Project>>(`${API_URL}/projects`, { params });
  }

  findOne(id: number): Observable<Project> {
    return this.client.get<Project>(`${API_URL}/projects/${id}`);
  }

  create(project: { name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja'; deadline?: string }): Observable<Project> {
    return this.client.post<Project>(`${API_URL}/projects`, project);
  }

  update(id: number, project: { name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja'; deadline?: string }): Observable<Project> {
    return this.client.patch<Project>(`${API_URL}/projects/${id}`, project);
  }

  remove(id: number): Observable<Project> {
    return this.client.delete<Project>(`${API_URL}/projects/${id}`);
  }
}
