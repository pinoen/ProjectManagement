import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { MessageService } from "primeng/api";
import { HttpClient } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { API_URL } from "../../app.constants";
import { Template } from "../../template/template";
import { ProyectosApiClient, Project, Client } from "../proyectos-api-client";
import { ClientesApiClient } from "../clientes-api-client";

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [
    Template,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    DialogModule,
    DatePipe
  ]
})
export class ProyectosListado implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly proyectosApiClient: ProyectosApiClient = inject(ProyectosApiClient);
  private readonly clientesApiClient: ClientesApiClient = inject(ClientesApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly http: HttpClient = inject(HttpClient);

  // Listas de datos
  proyectos: Project[] = [];
  clientes: Client[] = [];
  clientesDisponibles: Client[] = []; // Solo activos para selección

  // Paginación y búsqueda
  page: number = 1;
  limit: number = 10;
  search: string = "";
  status: string | null = null;
  totalRecords: number = 0;
  totalPages: number = 0;

  estadosFiltro = [
    { label: "Todos", value: null },
    { label: "Activo", value: "Activo" },
    { label: "Finalizado", value: "Finalizado" },
    { label: "Baja", value: "Baja" }
  ];

  // Controladores de Proyecto
  dialogoProyectoVisible: boolean = false;
  proyectoEnEdicion: { id?: number; name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja'; deadline?: string } = { name: "" };
  clienteSeleccionado: Client | null = null;
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarProyectos();
    this.cargarClientes();
  }

  cargarProyectos() {
    this.proyectosApiClient.findAll({
      page: this.page,
      limit: this.limit,
      search: this.search,
      status: this.status || undefined
    }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.proyectos = res.data;
          this.totalRecords = res.total;
          this.totalPages = res.totalPages;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los proyectos." });
      }
    });
  }

  cargarClientes() {
    // Para el combo de selección cargamos sin paginar (o un límite alto) para no tener problemas (lo que hablamos en el grupo de wapp)
    this.clientesApiClient.findAll({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.clientes = res.data;
          this.clientesDisponibles = this.clientes.filter(c => c.status === 'Activo');
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los clientes." });
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.cargarProyectos();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.cargarProyectos();
  }

  exportarCSV() {
    this.http.get(`${API_URL}/projects/export/csv`, { responseType: 'text' }).subscribe({
      next: (csvContent) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'proyectos.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo exportar a CSV." });
      }
    });
  }

  obtenerSeveridadEstado(status: string): 'success' | 'info' | 'danger' | 'secondary' {
    switch (status) {
      case 'Activo':
        return 'success';
      case 'Finalizado':
        return 'info';
      case 'Baja':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  abrirDialogoCrear() {
    this.esEdicion = false;
    this.proyectoEnEdicion = { name: "", status: "Activo", deadline: "" };
    this.clienteSeleccionado = null;
    this.dialogoProyectoVisible = true;
  }

  abrirDialogoEditar(proyecto: Project) {
    this.esEdicion = true;
    this.proyectoEnEdicion = {
      id: proyecto.id,
      name: proyecto.name,
      clientId: proyecto.client?.id,
      status: proyecto.status,
      deadline: proyecto.deadline ? proyecto.deadline.split('T')[0] : ''
    };
    this.clienteSeleccionado = proyecto.client || null;
    this.dialogoProyectoVisible = true;
  }

  guardarProyecto() {
    if (!this.proyectoEnEdicion.name) return;

    const payload = {
      name: this.proyectoEnEdicion.name,
      clientId: this.clienteSeleccionado ? this.clienteSeleccionado.id : undefined,
      status: this.proyectoEnEdicion.status,
      deadline: this.proyectoEnEdicion.deadline || undefined
    };

    if (this.esEdicion && this.proyectoEnEdicion.id) {
      this.proyectosApiClient.update(this.proyectoEnEdicion.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Proyecto actualizado correctamente." });
          this.cargarProyectos();
          this.dialogoProyectoVisible = false;
        },
        error: (err) => {
          let errorMsg = "No se pudo actualizar el proyecto.";
          if (err.error && err.error.message) errorMsg = err.error.message;
          this.messageService.add({ severity: "error", summary: "Error", detail: errorMsg });
        }
      });
    } else {
      this.proyectosApiClient.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Proyecto creado correctamente." });
          this.cargarProyectos();
          this.dialogoProyectoVisible = false;
        },
        error: (err) => {
          let errorMsg = "No se pudo crear el proyecto.";
          if (err.error && err.error.message) errorMsg = err.error.message;
          this.messageService.add({ severity: "error", summary: "Error", detail: errorMsg });
        }
      });
    }
  }

  eliminarProyecto(id: number) {
    this.proyectosApiClient.remove(id).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Éxito", detail: "Proyecto eliminado." });
        this.cargarProyectos();
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo eliminar el proyecto." });
      }
    });
  }

  verTareas(id: number) {
    this.router.navigate(['/proyectos', id, 'tareas']);
  }
}


