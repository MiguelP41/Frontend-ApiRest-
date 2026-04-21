import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; // Necesitas importar Subject y Observable
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarComunicacion {

  // 1. La fuente del evento (privada)
  private crearCategoriaSource = new Subject<void>();

  private busquedaSubject = new BehaviorSubject<string>('');
  busqueda$ = this.busquedaSubject.asObservable();
  
  // 2. El Observable (público) al que se suscribirá el Body
  crearCategoria$: Observable<void> = this.crearCategoriaSource.asObservable();

  // 3. El método que el Navbar llamará al hacer clic
  notificarCrearCategoria() {
    this.crearCategoriaSource.next();
  }
  
  // NUEVO: Función para emitir el término
  actualizarBusqueda(termino: string) {
    this.busquedaSubject.next(termino);
  }


  obtenerTermino() {
  return this.busquedaSubject.value;
}

}
