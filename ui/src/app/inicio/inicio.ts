import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Template } from "../template/template";
import { ProyectosApiClient, Project } from "../proyectos/proyectos-api-client";
import { ClientesApiClient } from "../proyectos/clientes-api-client";
import { TareasApiClient, Task } from "../proyectos/tareas/tareas-api-client";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.html",
  styleUrl: "./inicio.css",
  imports: [Template, CommonModule, RouterModule]
})
export class Inicio implements OnInit {
  private readonly proyectosApiClient = inject(ProyectosApiClient);
  private readonly clientesApiClient = inject(ClientesApiClient);
  private readonly tareasApiClient = inject(TareasApiClient);
  private readonly cdr = inject(ChangeDetectorRef);

  // ESTADISTICAS PRINCIPALES
  proyectosActivosCount: number = 0;
  clientesActivosCount: number = 0;
  tareasPendientesCount: number = 0;
  proyectosPorCliente: { clienteName: string; proyectosCount: number }[] = [];
  proyectosPorVencer: Project[] = [];
  tareasPorVencer: Task[] = [];

  ngOnInit() {
    this.cargarMetricas();
  }

  cargarMetricas() {
    forkJoin({
      proyectosActivos: this.proyectosApiClient.findAll({ status: 'Activo', limit: 1 }),
      clientesActivos: this.clientesApiClient.findAll({ status: 'Activo', limit: 1 }),
      tareasPendientes: this.tareasApiClient.findAll({ status: 'Pendiente', limit: 1 }),
      todosLosProyectos: this.proyectosApiClient.findAll({ limit: 100 }),
      todasLasTareas: this.tareasApiClient.findAll({ limit: 100 })
    }).subscribe({
      next: (res) => {
        this.proyectosActivosCount = res.proyectosActivos.total;
        this.clientesActivosCount = res.clientesActivos.total;
        this.tareasPendientesCount = res.tareasPendientes.total;

        // Calcular proyectos por cliente (este no incluye bajass)
        const proyectos = res.todosLosProyectos.data;
        const countsMap: { [clientName: string]: number } = {};

        proyectos.forEach(p => {
          if (p.status !== 'Baja') {
            const clientName = p.client ? p.client.name : 'Proyecto Interno';
            countsMap[clientName] = (countsMap[clientName] || 0) + 1;
          }
        });

        this.proyectosPorCliente = Object.keys(countsMap).map(name => ({
          clienteName: name,
          proyectosCount: countsMap[name]
        }));

        // Proyectos por vencer (Activos, con deadline, y con plazo <= 7 días)
        this.proyectosPorVencer = proyectos.filter(p =>
          p.status === 'Activo' &&
          p.deadline &&
          p.remainingDays !== null &&
          p.remainingDays !== undefined &&
          p.remainingDays <= 7
        ).sort((a, b) => (a.remainingDays ?? 0) - (b.remainingDays ?? 0));

        // Tareas por vencer (Pendientes, con deadline, y con plazo <= 7 días)
        this.tareasPorVencer = res.todasLasTareas.data.filter(t =>
          t.status === 'Pendiente' &&
          t.deadline &&
          t.remainingDays !== null &&
          t.remainingDays !== undefined &&
          t.remainingDays <= 7
        ).sort((a, b) => (a.remainingDays ?? 0) - (b.remainingDays ?? 0));

        this.cdr.detectChanges();
      },
      error: () => {
        // Vuelve atras
      }
    });
  }
}
