import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../../app.constants";
import { Project, PaginatedResult } from "../proyectos-api-client";

export interface Task {
  id: number;
  description: string;
  status: 'Pendiente' | 'Finalizado' | 'Baja';
  project?: Project;
  projectId?: number;
  deadline?: string;
  remainingDays?: number | null;
}

@Injectable({ providedIn: 'root' })
export class TareasApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(query?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC'; search?: string; status?: string; projectId?: number }): Observable<PaginatedResult<Task>> {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(key => {
        const val = (query as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.client.get<PaginatedResult<Task>>(`${API_URL}/tasks`, { params });
  }

  findOne(id: number): Observable<Task> {
    return this.client.get<Task>(`${API_URL}/tasks/${id}`);
  }

  create(taskData: { description: string; projectId: number; status?: 'Pendiente' | 'Finalizado' | 'Baja'; deadline?: string }): Observable<Task> {
    return this.client.post<Task>(`${API_URL}/tasks`, taskData);
  }

  update(id: number, taskData: { description?: string; projectId?: number; status?: 'Pendiente' | 'Finalizado' | 'Baja'; deadline?: string }): Observable<Task> {
    return this.client.patch<Task>(`${API_URL}/tasks/${id}`, taskData);
  }

  remove(id: number): Observable<Task> {
    return this.client.delete<Task>(`${API_URL}/tasks/${id}`);
  }
}
