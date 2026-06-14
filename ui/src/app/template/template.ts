import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { RouterModule } from "@angular/router";
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [ButtonModule, RouterModule]
})
export class Template {

    private readonly authStore: AuthStore = inject(AuthStore);

    get username(): string {
        return this.authStore.obtenerUsuario() ?? 'GrupoAT';
    }

    cerrarSesion() {
        this.authStore.cerrarSesion();
    }

}
