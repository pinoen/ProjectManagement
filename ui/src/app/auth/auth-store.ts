import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
/* CLASE PARA GUARDAR EL TOKEN EN SesionStorage */
@Injectable({
    providedIn: "root"
})
export class AuthStore {

    private readonly router: Router = inject(Router);

    guardarToken(token: string): void {
        sessionStorage.setItem("accessToken", token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem("accessToken");
    }

    cerrarSesion(): void {
        sessionStorage.removeItem("accessToken");
        this.router.navigateByUrl("/login");
    }
    /* Usuario logueado, para mostrar en /inicio y sidebar */
    obtenerUsuario(): string | null {
        const token = this.obtenerToken();
        if (!token) return null;
        try {
            const payloadBase64Url = token.split(".")[1];
            const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            return payload.username || null;
        } catch (e) {
            return null;
        }
    }

}
