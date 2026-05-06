import { NavbarComunicacion } from '../../services/navbar-comunicacion';
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  
  logoutClicked = output<void>();

  // 1. Inyectar el servicio de comunicación
  constructor(private comunicacionService: NavbarComunicacion, private router: Router ) {}

  // 2. FUNCIÓN LLAMADA DESDE EL HTML
  // Esta función llama al servicio para emitir la notificación.
  lanzarFormulario() {
    console.log('Botón Registrar Pago Presionado.');
    this.comunicacionService.notificarCrearCategoria();
  }


  onLogoutClick() {
    console.log('Evento de Logout emitido desde la Navbar.');
    this.logoutClicked.emit(); // Emite el evento al componente padre
  }


  

  mostrarBoton(): boolean {
        return !this.router.url.includes('nuevo-pago');
    }

}
