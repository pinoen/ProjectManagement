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
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../app.constants";
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

  private readonly http: HttpClient = inject(HttpClient);

  clientes: Client[] = [];

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
    { label: "Baja", value: "Baja" }
  ];

  // Controladores de Cliente
  dialogoClienteVisible: boolean = false;
  clienteEnEdicion: { id?: number; name: string; status?: 'Activo' | 'Baja' } = { name: "" };
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesApiClient.findAll({
      page: this.page,
      limit: this.limit,
      search: this.search,
      status: this.status || undefined
    }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.clientes = res.data;
          this.totalRecords = res.total;
          this.totalPages = res.totalPages;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar los clientes." });
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.cargarClientes();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.cargarClientes();
  }

  exportarCSV() {
    this.http.get(`${API_URL}/clients/export/csv`, { responseType: 'text' }).subscribe({
      next: (csvContent) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clientes.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo exportar a CSV." });
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
