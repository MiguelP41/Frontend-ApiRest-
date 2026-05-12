import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  // La URL de tu Postman  
  //private apiUrl = 'http://localhost:8080/v1/membresias';
  private apiUrl = 'https://apirest-books.onrender.com/v1/membresias';

  constructor(private http: HttpClient) { }

  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}