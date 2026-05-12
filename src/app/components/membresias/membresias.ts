import { Component, OnInit } from '@angular/core';
import { MembresiaService } from '../../services/membresia'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-membresias',
  imports: [
    CommonModule, // Esto quita los errores de *ngIf y [ngClass]
    FormsModule   // Esto quita los errores de ngModel
  ],
  templateUrl: './membresias.html'
})
export class MembresiasComponent implements OnInit {
  membresias: any[] = [];
  membresiasFiltradas: any[] = [];

  // Variables para los filtros (se conectan al HTML con ngModel)
  estadoFiltro: string = '';
  semanaFiltro: string = '';

  constructor(private service: MembresiaService) {}

  ngOnInit(): void {
  this.service.getMembresias().subscribe((data: any) => {
    // Según image_910dd8.png, la ruta es esta:
    if (data && data.membresiaResponse && data.membresiaResponse.membresias) {
      this.membresias = data.membresiaResponse.membresias;
      this.membresiasFiltradas = data.membresiaResponse.membresias;
      console.log('Membresías cargadas con éxito:', this.membresias);
    } else {
      console.error('La estructura del API no es la esperada', data);
      this.membresias = [];
      this.membresiasFiltradas = [];
    }
  });
}

  
aplicarFiltros() {
  const hoy = new Date();

  this.membresiasFiltradas = this.membresias.filter(m => {
    // 1. Filtro de Estado (Si el usuario eligió uno en el select)
    const cumpleEstado = this.estadoFiltro ? m.estado === this.estadoFiltro : true;

    // 2. Filtro de Semana
    let cumpleSemana = true;
    if (this.semanaFiltro) {
      // REGLA DE ORO: Solo filtramos por semana si la membresía está ACTIVA
      if (m.estado === 'ACTIVA') {
        const inicio = new Date(m.fechaInicio);
        const diferenciaDif = hoy.getTime() - inicio.getTime();
        const diasTranscurridos = Math.floor(diferenciaDif / (1000 * 60 * 60 * 24));
        const semanaActualUsuario = Math.floor(diasTranscurridos / 7) + 1;

        cumpleSemana = semanaActualUsuario === Number(this.semanaFiltro);
      } else {
        // Si no está activa, no cumple con el filtro de "semana en curso"
        cumpleSemana = false;
      }
    }

    return cumpleEstado && cumpleSemana;
  });
}
}