import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { LoginApiClient } from "./login-api-client";
import { MessageService } from "primeng/api";
import { AuthStore } from "../auth-store";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
/* METODO PARA LOGEARSE - [HACER MAS LINDO EL LOGIN: charlar en grupo wapp] */
@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule]
})
export class Login {

    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);
    private readonly messageService: MessageService = inject(MessageService);
    private readonly authStore: AuthStore = inject(AuthStore);
    private readonly router: Router = inject(Router);

    readonly form: FormGroup = new FormGroup({
        nombre: new FormControl("", [Validators.required]),
        clave: new FormControl("", [Validators.required])
    });

    iniciarSesion() {
        if (!this.form.valid) {
            this.messageService.add({ severity: "error", summary: "Error de validación", detail: "Todos los campos son obligatorios" });
            return;
        }

        const username = this.form.value.nombre;
        const password = this.form.value.clave;

        this.loginApiClient.iniciarSesion(username, password).subscribe({
            next: (data) => {
                this.authStore.guardarToken(data.access_token);
                this.router.navigateByUrl("/proyectos");
            },
            error: (err) => {
                let errorMsg = "Usuario o contraseña incorrectos";
                if (err.error && err.error.message) {
                    errorMsg = err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error de autenticación", detail: errorMsg });
            }
        });
    }

}
