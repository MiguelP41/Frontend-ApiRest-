import { Component, OnInit } from '@angular/core';
import { MembresiaService } from '../../services/membresia'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-membresias',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './membresias.html'
})
export class MembresiasComponent implements OnInit {

  membresias: any[] = [];
  membresiasFiltradas: any[] = [];
  membresiasPaginadas: any[] = [];

  estadoFiltro: string = '';
  semanaFiltro: string = '';

  // Paginación
  paginaActual: number = 0;
  itemsPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(private service: MembresiaService) {}

  ngOnInit(): void {
    this.service.getMembresias().subscribe((data: any) => {
      if (data && data.membresiaResponse && data.membresiaResponse.membresias) {
        this.membresias = data.membresiaResponse.membresias;
        this.membresiasFiltradas = data.membresiaResponse.membresias;
        console.log('Membresías cargadas con éxito:', this.membresias);
        this.actualizarPaginacion();
      } else {
        console.error('La estructura del API no es la esperada', data);
        this.membresias = [];
        this.membresiasFiltradas = [];
      }
    });
  }

  aplicarFiltros(): void {
    const hoy = new Date();

    this.membresiasFiltradas = this.membresias.filter(m => {
      const cumpleEstado = this.estadoFiltro ? m.estado === this.estadoFiltro : true;

      let cumpleSemana = true;
      if (this.semanaFiltro) {
        if (m.estado === 'ACTIVA') {
          const inicio = new Date(m.fechaInicio);
          const diferenciaDif = hoy.getTime() - inicio.getTime();
          const diasTranscurridos = Math.floor(diferenciaDif / (1000 * 60 * 60 * 24));
          const semanaActualUsuario = Math.floor(diasTranscurridos / 7) + 1;
          cumpleSemana = semanaActualUsuario === Number(this.semanaFiltro);
        } else {
          cumpleSemana = false;
        }
      }

      return cumpleEstado && cumpleSemana;
    });

    this.paginaActual = 0; // resetear a página 1 al filtrar
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.membresiasFiltradas.length / this.itemsPorPagina);
    const inicio = this.paginaActual * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.membresiasPaginadas = this.membresiasFiltradas.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }
}