import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { Inicio } from './inicio/inicio';
import { ClientesListado } from './clientes/clientes-listado';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "inicio",
        component: Inicio
    },
    {
        path: "clientes",
        component: ClientesListado
    },
    {
        path: 'proyectos/:id/tareas',
        component: TareasListado
    },
    {
        path: 'proyectos',
        component: ProyectosListado
    },
    {
        path: "**",
        redirectTo: "login"
    }
];

