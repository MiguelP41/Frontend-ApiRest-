import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs'; 
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface TokenResponse {
    token: string; 
    rol: string;   
}


@Injectable({
  providedIn: 'root'
})
export class Auth {

  //private LOGIN_URL ='http://localhost:8080/v1/authenticate';
  private LOGIN_URL ='https://apirest-books.onrender.com/v1/authenticate';
  private tokenKey = 'jwtToken';
  private roleKey = 'rol';

  constructor (private httpClient:HttpClient, private router: Router){}


    login(user: string, password: string ): Observable<any>{
      return this.httpClient.post<any>(this.LOGIN_URL, {usuario: user, contrasena: password}).pipe(
        tap(response => {

          if (response.jwtToken){
            this.setToken(response.jwtToken);
          //  console.log(response.jwtToken);

            this.setRole(response.rol); 
               // console.log("Token:", response.token);
               // console.log("Rol:", response.rol);
          
          }

        })

      )
    }
  

    //Metodo que Guarda el Token en el Local Storage
    private setToken(token: string): void{
      localStorage.setItem(this.tokenKey, token); 
    }

    //Metodo que recupera el Token del local Storage
    private getToken(): string | null{

      return localStorage.getItem(this.tokenKey)
    }

    private setRole(rol: string): void{
      localStorage.setItem(this.roleKey, rol);
    }

    public getRole(): string | null {
      return localStorage.getItem(this.roleKey);
    }



    //Validacion si el usuario esta Autenticado o no 
    isAuthenticated(): boolean{
      const token = this.getToken();

      if(!token){
        return false
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;

    }


    //Metodo cerrar sesion
    logout(): void{
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.roleKey);
      this.router.navigate(['/login']);
    }

}
