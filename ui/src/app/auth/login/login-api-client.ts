import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../../app.constants";

@Injectable({ providedIn: 'root' })
export class LoginApiClient {

    private readonly client: HttpClient = inject(HttpClient);

    iniciarSesion(username: string, password: string): Observable<{ access_token: string }> {
        return this.client.post<{ access_token: string }>(`${API_URL}/auth/login`, { username, password });
    }

}
