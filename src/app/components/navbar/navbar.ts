import { NavbarComunicacion } from '../../services/navbar-comunicacion';
import { Component, OnInit, output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf

@Component({
  selector: 'app-navbar',
  standalone: true, // Asegúrate de que sea standalone si no usas NgModules
  imports: [CommonModule], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  logoutClicked = output<void>();
  
  // 1. Definir la variable que usa el HTML
  esGestionPagos: boolean = false;

  constructor(
    private comunicacionService: NavbarComunicacion,
    private router: Router // Inyectar Router para detectar la página
  ) {}

  ngOnInit() {
  // 1. Evaluar la ruta inmediatamente al cargar (para el F5)
  this.evaluarRuta(this.router.url);

  // 2. Mantener la escucha para cambios de navegación futuros
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    this.evaluarRuta(event.url);
  });
}

// Creamos una función reutilizable para no repetir código
private evaluarRuta(url: string) {
  this.esGestionPagos = url.includes('ClientesAdmin') || url.includes('GestionPagos');
}

  lanzarFormulario() {
    console.log('Botón Crear Categoría presionado.');
    this.comunicacionService.notificarCrearCategoria();
  }

  // 3. Función para enviar lo que el usuario escribe al servicio
  onSearch(event: any) {
    const valor = event.target.value;
    this.comunicacionService.actualizarBusqueda(valor);
  }

  onLogoutClick() {
    console.log('Evento de Logout emitido desde la Navbar.');
    this.logoutClicked.emit();
  }
}