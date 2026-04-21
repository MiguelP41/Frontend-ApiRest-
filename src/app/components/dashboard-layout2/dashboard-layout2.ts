import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs'; // ✅ Añadido interval
import { switchMap, startWith } from 'rxjs/operators'; // ✅ Añadido para tiempo real

// Registro de Swiper para que funcione el carrusel
import { register } from 'swiper/element/bundle';
register();

// Importación de tus servicios
import { Comprobantes } from '../../services/comprobantes';
import { NavbarComunicacion } from '../../services/navbar-comunicacion';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-layout2.html',
  styleUrl: './dashboard-layout2.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardLayout implements OnInit, OnDestroy {

  // Propiedades de datos
  comprobantesCompletos: any[] = [];
  comprobantesFiltrados: any[] = [];
  arrComprobantes: any[] = [];

  // Paginación
  paginaActual: number = 0;
  totalPaginas: number = 0;
  elementosPorPagina: number = 10;

  // Estados de vista
  mostrarFormulario: boolean = false;
  mostrarTabla: boolean = true;
  mostrarModal: boolean = false;
  mostrarLightbox: boolean = false;
  
  registroSeleccionado: any | null = null;
  urlImagenSeleccionada: string = '';
  URL_BASE_IMAGENES: string = 'http://localhost:8080/uploads/categorias/';

  // Suscripciones
  private comunicacionSubscription!: Subscription;
  private pollingSubscription!: Subscription; // ✅ Suscripción para el polling
  private busquedaSubscription!: Subscription;

  constructor(
    private _comprobantes: Comprobantes,
    private comunicacionService: NavbarComunicacion
  ) { }

  ngOnInit(): void {
  // 1. ESCUCHAR EL BUSCADOR (Añade esto)
  this.busquedaSubscription = this.comunicacionService.busqueda$.subscribe(termino => {
    this.aplicarFiltroLocal(termino);
  });

  // 2. TU POLLING (Modificado ligeramente para no borrar la búsqueda)
  this.pollingSubscription = interval(5000)
    .pipe(
      startWith(0),
      switchMap(() => this._comprobantes.obtenerComprobantes())
    )
    .subscribe({
      next: (respuesta: any) => {
        // Usamos la ruta de datos que me mostraste al principio
        const nuevosComprobantes = respuesta?.comprobantesResponse?.comprobantes || [];
        
        if (JSON.stringify(this.comprobantesCompletos) !== JSON.stringify(nuevosComprobantes)) {
          this.comprobantesCompletos = nuevosComprobantes;
          this.totalPaginas = Math.ceil(this.comprobantesCompletos.length / this.elementosPorPagina);
          
          // CLAVE: Cuando lleguen datos nuevos, aplicamos el filtro que esté en el buscador
          const terminoActual = this.comunicacionService.obtenerTermino(); // Necesitaremos esta pequeña función en el servicio
          this.aplicarFiltroLocal(terminoActual || '');
        }
      }
    });

  // Tu lógica de crear categoría (No se toca)
  this.comunicacionSubscription = this.comunicacionService.crearCategoria$.subscribe(() => {
    this.mostrarFormulario = true;
    this.mostrarTabla = false;
  });
}


aplicarFiltroLocal(t: string) {
  if (!t || t.trim() === '') {
    this.actualizarPaginaActual(); // Si no hay búsqueda, usa tu paginación normal
  } else {
    const term = t.toLowerCase().trim();
    const filtrados = this.comprobantesCompletos.filter(c => 
      c.referenciaBancaria?.toString().toLowerCase().includes(term) ||
      c.monto?.toString().includes(term)
    );
    // Mostramos los resultados (limitados a 10 para no romper el diseño)
    this.arrComprobantes = filtrados.slice(0, this.elementosPorPagina);
  }
}

  // --- MÉTODOS DE DATOS ---

  obtenerComprobantes() {
    this._comprobantes.obtenerComprobantes().subscribe((respuesta: any) => {
      this.comprobantesCompletos = respuesta?.comprobanteResponse?.comprobante || [];
      this.totalPaginas = Math.ceil(this.comprobantesCompletos.length / this.elementosPorPagina);
      this.actualizarPaginaActual();
    });
  }

  actualizarPaginaActual() {
    const inicio = this.paginaActual * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.arrComprobantes = this.comprobantesCompletos.slice(inicio, fin);
  }

  // --- NAVEGACIÓN ---

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarPaginaActual();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.actualizarPaginaActual();
    }
  }

  // --- ACCIONES ---

  handleDescarga(idCategoria: number) {
    if (idCategoria) {
      this._comprobantes.descargarPdf(idCategoria);
    }
  }

  verDetalleHistoria(idHistoria: number): void {
    this._comprobantes.obtenerRegistroPorId(idHistoria).subscribe({
      next: (data: any) => {
        this.registroSeleccionado = data;
        this.mostrarModal = true;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  manejarCategoriaGuardada() {
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
    this.obtenerComprobantes();
  }

  // --- CONTROL DE UI (MODALES/LIGHTBOX) ---

  cerrarModal(): void {
    this.mostrarModal = false;
    this.registroSeleccionado = null;
  }

  abrirLightbox(url: string): void {
    this.urlImagenSeleccionada = url;
    this.mostrarLightbox = true;
  }

  cerrarLightbox(): void {
    this.mostrarLightbox = false;
    this.urlImagenSeleccionada = '';
  }

  // --- LIMPIEZA ---

  ngOnDestroy(): void {
    // Liberamos las suscripciones para evitar fugas de memoria
    if (this.comunicacionSubscription) {
      this.comunicacionSubscription.unsubscribe();
    }
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}