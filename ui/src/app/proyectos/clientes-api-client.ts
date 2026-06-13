import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../app.constants";
import { Client } from "./proyectos-api-client";

@Injectable({ providedIn: 'root' })
export class ClientesApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  findAll(): Observable<Client[]> {
    return this.client.get<Client[]>(`${API_URL}/clients`);
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
