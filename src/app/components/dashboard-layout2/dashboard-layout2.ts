import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Registro de Swiper para que funcione el carrusel
import { register } from 'swiper/element/bundle';
register();

// Importación de tus servicios y componentes
import { Categorias } from '../../services/categorias';
import { NavbarComunicacion } from '../../services/navbar-comunicacion';
import { FormCategoriaComponent } from '../form-categoria/form-categoria';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, FormCategoriaComponent],
  templateUrl: './dashboard-layout2.html',
  styleUrl: './dashboard-layout2.css',
  // 🟢 ESENCIAL: Permite usar etiquetas personalizadas como <swiper-container>
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardLayout implements OnInit, OnDestroy {

  // Propiedades de datos
  categoriasCompletas: any[] = [];
  arrCategorias: any[] = [];

  // Paginación (Se mantiene por si decides filtrar el carrusel)
  paginaActual: number = 0;
  totalPaginas: number = 0;
  elementosPorPagina: number = 10; // Aumentado para que el carrusel tenga más items

  // Estados de vista
  mostrarFormulario: boolean = false;
  mostrarTabla: boolean = true;
  mostrarModal: boolean = false;
  mostrarLightbox: boolean = false;
  
  registroSeleccionado: any | null = null;
  urlImagenSeleccionada: string = '';
  URL_BASE_IMAGENES: string = 'http://localhost:8080/uploads/categorias/';

  private comunicacionSubscription!: Subscription;

  constructor(
    private _categorias: Categorias,
    private comunicacionService: NavbarComunicacion
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
    
    // Suscripción al servicio de comunicación del Navbar
    this.comunicacionSubscription = this.comunicacionService.crearCategoria$.subscribe(() => {
      this.mostrarFormulario = true;
      this.mostrarTabla = false;
    });
  }

  // Obtención de datos y lógica de paginación
  obtenerCategorias() {
    this._categorias.obtenerCategorias().subscribe((respuesta: any) => {
      this.categoriasCompletas = respuesta?.categoriaResponse?.categoria || [];
      this.totalPaginas = Math.ceil(this.categoriasCompletas.length / this.elementosPorPagina);
      this.paginaActual = 0;
      this.actualizarPaginaActual();
    });
  }

  actualizarPaginaActual() {
    const inicio = this.paginaActual * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.arrCategorias = this.categoriasCompletas.slice(inicio, fin);
  }

  // Métodos de navegación de página
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

  // Acciones de archivos y detalles
  handleDescarga(idCategoria: number) {
    if (idCategoria) {
      this._categorias.descargarPdf(idCategoria);
    }
  }

  verDetalleHistoria(idHistoria: number): void {
    this._categorias.obtenerRegistroPorId(idHistoria).subscribe({
      next: (data: any) => {
        this.registroSeleccionado = data;
        this.mostrarModal = true;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // Control de Modales y Lightbox
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

  manejarCategoriaGuardada() {
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
    this.obtenerCategorias();
  }

  ngOnDestroy(): void {
    if (this.comunicacionSubscription) {
      this.comunicacionSubscription.unsubscribe();
    }
  }
}