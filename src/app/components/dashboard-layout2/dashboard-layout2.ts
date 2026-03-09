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

  constructor(
    private _comprobantes: Comprobantes,
    private comunicacionService: NavbarComunicacion
  ) { }

  ngOnInit(): void {
    // 🟢 LÓGICA DE POLLING (Tiempo Real)
    // Consulta al servidor cada 5 segundos
    this.pollingSubscription = interval(5000)
      .pipe(
        startWith(0), // Ejecuta la primera carga de inmediato
        switchMap(() => this._comprobantes.obtenerComprobantes()) // Consulta al API
      )
      .subscribe({
        next: (respuesta: any) => {
          const nuevosComprobantes = respuesta?.comprobantesResponse?.comprobantes || [];
          
          // Solo actualizamos si la data ha cambiado para no parpadear el UI
          if (JSON.stringify(this.comprobantesCompletos) !== JSON.stringify(nuevosComprobantes)) {
            this.comprobantesCompletos = nuevosComprobantes;
            this.totalPaginas = Math.ceil(this.comprobantesCompletos.length / this.elementosPorPagina);
            this.actualizarPaginaActual();
          }
        },
        error: (err) => console.error('Error en polling:', err)
      });
    
    // Suscripción al servicio de comunicación del Navbar
    this.comunicacionSubscription = this.comunicacionService.crearCategoria$.subscribe(() => {
      this.mostrarFormulario = true;
      this.mostrarTabla = false;
    });
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