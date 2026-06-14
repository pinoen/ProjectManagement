import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { Checkbox } from "primeng/checkbox";
import { MessageService } from "primeng/api";
import { HttpClient } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { API_URL } from "../../../app.constants";
import { Template } from "../../../template/template";
import { ProyectosApiClient, Project } from "../../proyectos-api-client";
import { TareasApiClient, Task } from "../tareas-api-client";

@Component({
  selector: "app-tareas-listado",
  templateUrl: "./tareas-listado.html",
  styleUrls: ["./tareas-listado.css"],
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
    Checkbox,
    DatePipe
  ]
})
export class TareasListado implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly proyectosApiClient: ProyectosApiClient = inject(ProyectosApiClient);
  private readonly tareasApiClient: TareasApiClient = inject(TareasApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly http: HttpClient = inject(HttpClient);

  projectId!: number;
  proyecto: Project | null = null;

  tareas: Task[] = [];

  // Paginaciom y búsqueda
  page: number = 1;
  limit: number = 10;
  search: string = "";
  status: string | null = null;
  totalRecords: number = 0;
  totalPages: number = 0;

  estadosFiltro = [
    { label: "Todos", value: null },
    { label: "Pendiente", value: "Pendiente" },
    { label: "Finalizado", value: "Finalizado" },
    { label: "Baja", value: "Baja" }
  ];

  // Formulario de tareas
  dialogoTareaVisible: boolean = false;
  tareaEnEdicion: { id?: number; description: string; status?: 'Pendiente' | 'Finalizado' | 'Baja'; projectId?: number; deadline?: string } = { description: "" };
  esEdicion: boolean = false;

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosProyecto();
    this.cargarTareas();
  }

  cargarDatosProyecto() {
    this.proyectosApiClient.findOne(this.projectId).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.proyecto = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo cargar el proyecto." });
      }
    });
  }

  cargarTareas() {
    this.tareasApiClient.findAll({
      projectId: this.projectId,
      page: this.page,
      limit: this.limit,
      search: this.search,
      status: this.status || undefined
    }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.tareas = res.data;
          this.totalRecords = res.total;
          this.totalPages = res.totalPages;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar las tareas." });
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.cargarTareas();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.cargarTareas();
  }

  exportarCSV() {
    this.http.get(`${API_URL}/tasks/export/csv`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tareas-proyecto-${this.projectId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo exportar a CSV." });
      }
    });
  }

  obtenerSeveridadEstado(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Finalizado':
        return 'success';
      case 'Pendiente':
        return 'warn';
      case 'Baja':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  abrirDialogoCrear() {
    this.esEdicion = false;
    this.tareaEnEdicion = { description: "", status: "Pendiente", projectId: this.projectId, deadline: "" };
    this.dialogoTareaVisible = true;
  }

  abrirDialogoEditar(tarea: Task) {
    this.esEdicion = true;
    this.tareaEnEdicion = {
      id: tarea.id,
      description: tarea.description,
      status: tarea.status,
      projectId: this.projectId,
      deadline: tarea.deadline ? tarea.deadline.split('T')[0] : ''
    };
    this.dialogoTareaVisible = true;
  }

  toggleCompletada(tarea: Task) {
    const nuevoEstado = tarea.status === 'Finalizado' ? 'Pendiente' : 'Finalizado';

    this.tareasApiClient.update(tarea.id, { status: nuevoEstado }).subscribe({
      next: () => {
        this.cargarTareas();
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar el estado de la tarea." });
      }
    });
  }

  guardarTarea() {
    if (!this.tareaEnEdicion.description) return;

    if (this.esEdicion && this.tareaEnEdicion.id) {
      const payload = {
        description: this.tareaEnEdicion.description,
        status: this.tareaEnEdicion.status,
        projectId: this.projectId,
        deadline: this.tareaEnEdicion.deadline || undefined
      };

      this.tareasApiClient.update(this.tareaEnEdicion.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Tarea actualizada." });
          this.cargarTareas();
          this.dialogoTareaVisible = false;
        },
        error: (err) => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar la tarea." });
        }
      });
    } else {
      const payload = {
        description: this.tareaEnEdicion.description,
        projectId: this.projectId,
        status: this.tareaEnEdicion.status || 'Pendiente',
        deadline: this.tareaEnEdicion.deadline || undefined
      };

      this.tareasApiClient.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Tarea creada." });
          this.cargarTareas();
          this.dialogoTareaVisible = false;
        },
        error: (err) => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo crear la tarea." });
        }
      });
    }
  }

  eliminarTarea(id: number) {
    this.tareasApiClient.remove(id).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Éxito", detail: "Tarea eliminada (Baja)." });
        this.cargarTareas();
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo eliminar la tarea." });
      }
    });
  }

  volverAProyectos() {
    this.router.navigate(['/proyectos']);
  }
}


