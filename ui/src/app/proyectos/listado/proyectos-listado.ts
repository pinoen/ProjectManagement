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
    DialogModule
  ]
})
export class ProyectosListado implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly proyectosApiClient: ProyectosApiClient = inject(ProyectosApiClient);
  private readonly clientesApiClient: ClientesApiClient = inject(ClientesApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Listas de datos
  proyectos: Project[] = [];
  clientes: Client[] = [];
  clientesDisponibles: Client[] = []; // Solo activos para selección

  // Controladores de diálogo de Proyecto
  dialogoProyectoVisible: boolean = false;
  proyectoEnEdicion: { id?: number; name: string; clientId?: number; status?: 'Activo' | 'Finalizado' | 'Baja' } = { name: "" };
  clienteSeleccionado: Client | null = null;
  esEdicion: boolean = false;


  ngOnInit() {
    this.cargarProyectos();
    this.cargarClientes();
  }

  cargarProyectos() {
    this.proyectosApiClient.findAll().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.proyectos = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los proyectos." });
      }
    });
  }

  cargarClientes() {
    this.clientesApiClient.findAll().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.clientes = data;
          // Solo clientes activos para asociar a proyectos
          this.clientesDisponibles = this.clientes.filter(c => c.status === 'Activo');
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los clientes." });
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
    this.proyectoEnEdicion = { name: "", status: "Activo" };
    this.clienteSeleccionado = null;
    this.dialogoProyectoVisible = true;
  }

  abrirDialogoEditar(proyecto: Project) {
    this.esEdicion = true;
    this.proyectoEnEdicion = { 
      id: proyecto.id,
      name: proyecto.name,
      clientId: proyecto.client?.id,
      status: proyecto.status
    };
    this.clienteSeleccionado = proyecto.client || null;
    this.dialogoProyectoVisible = true;
  }

  guardarProyecto() {
    if (!this.proyectoEnEdicion.name) return;

    // Asignar id de cliente seleccionado
    const payload = {
      name: this.proyectoEnEdicion.name,
      clientId: this.clienteSeleccionado ? this.clienteSeleccionado.id : undefined,
      status: this.proyectoEnEdicion.status
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


