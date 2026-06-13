import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../app.constants";
import { Client, PaginatedResult } from "./proyectos-api-client";

@Injectable({ providedIn: 'root' })
export class ClientesApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(query?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC'; search?: string; status?: string }): Observable<PaginatedResult<Client>> {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(key => {
        const val = (query as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.client.get<PaginatedResult<Client>>(`${API_URL}/clients`, { params });
  }

  findOne(id: number): Observable<Client> {
    return this.client.get<Client>(`${API_URL}/clients/${id}`);
  }

  create(clientData: { name: string; status?: 'Activo' | 'Baja' }): Observable<Client> {
    return this.client.post<Client>(`${API_URL}/clients`, clientData);
  }

  update(id: number, clientData: { name: string; status?: 'Activo' | 'Baja' }): Observable<Client> {
    return this.client.patch<Client>(`${API_URL}/clients/${id}`, clientData);
  }

  remove(id: number): Observable<Client> {
    return this.client.delete<Client>(`${API_URL}/clients/${id}`);
  }
}
