import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; // Necesitas importar Subject y Observable



@Injectable({
  providedIn: 'root'
})
export class NavbarComunicacion {

  // 1. La fuente del evento (privada)
  private crearCategoriaSource = new Subject<void>();
  
  // 2. El Observable (público) al que se suscribirá el Body
  crearCategoria$: Observable<void> = this.crearCategoriaSource.asObservable();

  // 3. El método que el Navbar llamará al hacer clic
  notificarCrearCategoria() {
    this.crearCategoriaSource.next();
  }
  
}
