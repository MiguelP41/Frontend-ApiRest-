import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
 selector: 'app-root',
 // Es crucial incluir LoginComponent en los imports, ya que es standalone.
 standalone: true, 
 imports: [RouterOutlet, CommonModule],
 templateUrl: './app.html', // Usaremos @if/else en este HTML
 styleUrl: './app.css'
 })

 
export class App {

  constructor(private router: Router) { 
    // Opcional: Podrías inicializar el estado de autenticación aquí 
    // basado en si ya existe un token en localStorage
  }
  protected readonly title = signal('clienteFront');
 
  isAuthenticated = signal(false); 

  

  handleLogout() {
   console.log('Logout invocado.');
    // 🚩 Vuelve el estado a false para mostrar la vista de Login
    this.isAuthenticated.set(false);
    this.isAuthenticated.set(true);  
   }
}