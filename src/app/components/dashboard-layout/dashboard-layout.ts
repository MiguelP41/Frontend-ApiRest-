
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
// Importa tus componentes de la aplicación protegida (Navbar, Body)
import { Navbar } from '../navbar/navbar';
import { Body } from '../body/body';
// Importa el LoginComponent
import { LoginComponent } from '../login/login'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router'; // <--- ¡ESTO!



@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Navbar, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
  constructor(private router: Router) {
    
  }

  /**
   * Maneja el evento de logout emitido por el componente <app-navbar>.
   * Limpia la sesión y navega a la ruta de login.
   */
  handleLogout() {
    console.log('Logout desde Layout. Navegando a /login.');
    
    // 1. Limpiar el token (o llamar a un servicio de AuthService para hacerlo)
    localStorage.removeItem('jwtToken');
    
    // 2. Navegar a la ruta de login
    this.router.navigate(['/login']);
  }



}
