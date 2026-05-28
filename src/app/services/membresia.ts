import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  // La URL de tu Postman  
  //private apiUrl = 'http://localhost:8080/v1/membresias';
  private apiUrl = `${environment.apiUrl}/membresias`;
  private url = `${environment.apiUrl}/membresias/procesar/manual`;
  

  constructor(private http: HttpClient) { }

  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  crearMembresia(membresia: any) {
    console.log('Datos de Membresia a enviar al Backend:', membresia);

    const headers = new HttpHeaders({
      // Aquí puedes agregar headers, como el de Autorización si lo necesitas
    });

    // Utiliza el método POST para enviar los datos al backend
    return this.http.post(this.url, membresia, { headers: headers });
  }



}