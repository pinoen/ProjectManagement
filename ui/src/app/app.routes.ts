import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { Inicio } from './inicio/inicio';
import { ClientesListado } from './clientes/clientes-listado';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "inicio",
        component: Inicio,
        canActivate: [authGuard]
    },
    {
        path: "clientes",
        component: ClientesListado,
        canActivate: [authGuard]
    },
    {
        path: 'proyectos/:id/tareas',
        component: TareasListado,
        canActivate: [authGuard]
    },
    {
        path: 'proyectos',
        component: ProyectosListado,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];

