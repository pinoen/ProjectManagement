import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { MessageService } from "primeng/api";
import { Template } from "../template/template";
import { ClientesApiClient } from "../proyectos/clientes-api-client";
import { Client } from "../proyectos/proyectos-api-client";

@Component({
  selector: "app-clientes-listado",
  templateUrl: "./clientes-listado.html",
  styleUrl: "./clientes-listado.css",
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
export class ClientesListado implements OnInit {
  private readonly clientesApiClient: ClientesApiClient = inject(ClientesApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  clientes: Client[] = [];

  // Controladores de Cliente
  dialogoClienteVisible: boolean = false;
  clienteEnEdicion: { id?: number; name: string; status?: 'Activo' | 'Baja' } = { name: "" };
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesApiClient.findAll().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.clientes = data;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los clientes." });
      }
    });
  }

  abrirDialogoCrear() {
    this.esEdicion = false;
    this.clienteEnEdicion = { name: "", status: "Activo" };
    this.dialogoClienteVisible = true;
  }

  abrirDialogoEditar(cliente: Client) {
    this.esEdicion = true;
    this.clienteEnEdicion = { ...cliente };
    this.dialogoClienteVisible = true;
  }

  guardarCliente() {
    if (!this.clienteEnEdicion.name) return;

    const payload = {
      name: this.clienteEnEdicion.name,
      status: this.clienteEnEdicion.status
    };

    if (this.esEdicion && this.clienteEnEdicion.id) {
      this.clientesApiClient.update(this.clienteEnEdicion.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Cliente actualizado correctamente." });
          this.cargarClientes();
          this.dialogoClienteVisible = false;
        },
        error: (err) => {
          let errorMsg = "No se pudo actualizar el cliente.";
          if (err.error && err.error.message) errorMsg = err.error.message;
          this.messageService.add({ severity: "error", summary: "Error", detail: errorMsg });
        }
      });
    } else {
      this.clientesApiClient.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Cliente creado correctamente." });
          this.cargarClientes();
          this.dialogoClienteVisible = false;
        },
        error: (err) => {
          let errorMsg = "No se pudo crear el cliente.";
          if (err.error && err.error.message) errorMsg = err.error.message;
          this.messageService.add({ severity: "error", summary: "Error", detail: errorMsg });
        }
      });
    }
  }

  eliminarCliente(id: number) {
    this.clientesApiClient.remove(id).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Éxito", detail: "Cliente dado de baja." });
        this.cargarClientes();
      },
      error: (err) => {
        let errorMsg = "No se pudo dar de baja el cliente.";
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.messageService.add({ severity: "error", summary: "Restricción de Negocio", detail: errorMsg });
      }
    });
  }
}
