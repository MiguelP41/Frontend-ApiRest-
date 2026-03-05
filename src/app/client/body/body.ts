import { Comprobantes } from '../../services/comprobantes';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormCategoriaComponent } from '../form-categoria/form-categoria';
import { NavbarComunicacion } from '../../services/navbar-comunicacion';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-body',
  // NOTA: Agregar HttpClientModule solo es necesario si *este* componente
  // fuera el que usa HttpClient directamente. En Angular moderno y standalone,
  // es mejor incluir el módulo en el array 'imports' del componente raíz si aplica,
  // o donde se use HttpClient. Aquí no lo necesitas si solo lo usa el servicio.
  imports: [CommonModule, FormCategoriaComponent],
  templateUrl: './body.html',
  styleUrl: './body.css'
})

export class Body implements OnInit, OnDestroy {

  // La lista completa de categorías (sin paginar)
  comprobantesCompletos: any[] = [];
  // La lista de categorías que se mostrará en la tabla (la página actual)
  arrCategorias: any[] = [];


  // 🆕 PROPIEDADES DE PAGINACIÓN
  paginaActual: number = 0;
  totalPaginas: number = 0;
  elementosPorPagina: number = 6;

  // Control de visibilidad del formulario
  mostrarFormulario: boolean = false;
  mostrarTabla: boolean = true;
  private comunicacionSubscription!: Subscription;

  registroSeleccionado: any | null = null;
  mostrarModal: boolean = false; // Controla la visibilidad del modal

  constructor(
    private _comprobantes: Comprobantes,
    private comunicacionService: NavbarComunicacion
    
  ) { }

    ngOnInit(): void {
      this.obtenerComprobantes()
      this.comunicacionSubscription = this.comunicacionService.crearCategoria$.subscribe(() => {
        this.mostrarFormulario = true;
        this.mostrarTabla = false;
      });
    }

  // ----------------------------------------------------
  // 🔄 FUNCIÓN ACTUALIZADA PARA LA PAGINACIÓN
  // ----------------------------------------------------
  obtenerComprobantes() {
    this._comprobantes.obtenerComprobantes()
      .subscribe((respuesta: any) => {
        // 1. Guarda todas las categorías obtenidas del API
        this.comprobantesCompletos = respuesta?.comprobantesResponse?.comprobantes || [];
        console.log("Comprobantes completas:", this.comprobantesCompletos);

        // 2. Calcula el número total de páginas
        this.totalPaginas = Math.ceil(this.comprobantesCompletos.length / this.elementosPorPagina);

        // 3. Establece la página actual a 0 (la primera)
        this.paginaActual = 0;

        // 4. Muestra la primera página
        this.actualizarPaginaActual();
      });
  }

  // ----------------------------------------------------
  // 🌐 FUNCIÓN NUEVA: Actualiza el contenido de la tabla
  // ----------------------------------------------------
  actualizarPaginaActual() {
    const inicio = this.paginaActual * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;

    // Obtiene el slice (subconjunto) de categorías para la página actual
    this.arrCategorias = this.comprobantesCompletos.slice(inicio, fin);
    console.log(`Mostrando página ${this.paginaActual + 1} de ${this.totalPaginas}`, this.arrCategorias);
  }

  // ----------------------------------------------------
  // ⬅️ FUNCIÓN NUEVA: Para ir a la página anterior
  // ----------------------------------------------------
  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarPaginaActual();
    }
  }

  // ----------------------------------------------------
  // ➡️ FUNCIÓN NUEVA: Para ir a la página siguiente
  // ----------------------------------------------------
  paginaSiguiente() {
    // La página actual es base 0, totalPaginas es base 1.
    // Ejemplo: 2 páginas (0 y 1). totalPaginas = 2.
    // Si paginaActual=1, 1 < 2 - 1 (1 < 1) es falso. NO AVANZA. ¡CORRECTO!
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.actualizarPaginaActual();
    }
  }

  // ----------------------------------------------------
  // NUEVA FUNCIÓN PARA EL BOTÓN DE DESCARGA
  // ----------------------------------------------------
  handleDescarga(idCategoria: number) {
    if (idCategoria) {
      console.log('Iniciando descarga de PDF para ID:', idCategoria);
      this._comprobantes.descargarPdf(idCategoria);
    }
  }

  // 3. MANEJA EVENTO DE GUARDADO
  manejarCategoriaGuardada() {
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
    // Refresca la lista completa y recalcula la paginación
    this.obtenerComprobantes();
  }

  ngOnDestroy(): void {
    if (this.comunicacionSubscription) {
      this.comunicacionSubscription.unsubscribe();
    }
  }


 // Método actualizado: Carga los datos y muestra el modal
verDetalleHistoria(idHistoria: number): void {
  console.log('Cargando detalle para ID:', idHistoria);

  this._comprobantes.obtenerRegistroPorId(idHistoria)
    .subscribe({ 
      next: (data: any) => { // Éxito
        this.registroSeleccionado = data;
        this.mostrarModal = true; 
      },
      error: (error: any) => { // Error
        console.error('Error al cargar el detalle:', error);
      }
      // Opcional: complete: () => { console.log('Petición finalizada'); }
    });
}

// Función para cerrar el modal
cerrarModal(): void {
  this.mostrarModal = false;
  this.registroSeleccionado = null; // Limpiar los datos
}
  
URL_BASE_IMAGENES: string = 'http://localhost:8080/uploads/categorias/'; // 👈 ¡AJUSTA ESTA RUTA!

getBaseUrlImagen(): string {

    return this.URL_BASE_IMAGENES; 
}


mostrarLightbox: boolean = false; 

urlImagenSeleccionada: string = '';

abrirLightbox(url: string): void {
    this.urlImagenSeleccionada = url;
    this.mostrarLightbox = true;
}


cerrarLightbox(): void {
    this.mostrarLightbox = false;
    this.urlImagenSeleccionada = '';
}
}