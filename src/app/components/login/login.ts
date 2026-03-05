import { Component, ChangeDetectionStrategy, signal, output, inject} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
// Eliminamos FormsModule porque usamos ReactiveFormsModule
// import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', 
  styleUrl: './login.css', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoginComponent {
  
  loginSuccess = output<void>();
  
  // 1. INYECCIÓN MODERNA: Usamos inject() para todos los servicios
  private router = inject(Router);
  private authService = inject(Auth); // <--- CAMBIO CLAVE

  // Propiedades públicas (accesibles en el HTML)
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Formulario Reactivo (Propiedad pública)
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // 2. Eliminamos el constructor, ya que las inyecciones se hicieron arriba
  // constructor(private authService: Auth) {} 
  
  // Usamos un constructor vacío si no hay lógica, o simplemente lo eliminamos
  constructor() {} 

  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    
    // Obtener los valores (uso seguro de getRawValue en formularios tipados)
    const { username, password } = this.loginForm.getRawValue();

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(username!, password!).subscribe({
      next:() => {
        this.isLoading.set(false);
        const userRole = this.authService.getRole();

        if (userRole === 'ROLE_Jefe'){
          console.log('Redirigiendo a Dasboard Administrativo');
          this.router.navigate(['/Dasboard']);
        } else if (userRole === 'ROLE_Empleado'){
          console.log('Redirigiendo a Dasboard Cliente');
          this.router.navigate(['/Client']);
          //this.authService.logout();
          
        } else {     
          this.router.navigate(['/login']);
        }
        
        
        
        console.log('Login exitoso. Cambiando a vista de aplicación.');
        //this.router.navigate(['/Dasboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales incorrectas.');
        console.error('Login Failed', err);
      }
    });
  }



 //login(): void {
    //this.errorMessage = null;
 //   this.authService.login(this.user, this.password).subscribe({
 //   next:() => {
 //         console.log('Login exitoso. Cambiando a vista de aplicación.');
 //         this.router.navigate(['/Dasboard']);
          //this.loginSuccess.emit();
 //     },
 //    error: (err) => {
       // this.errorMessage = 'Credenciales incorrectas.';
 //       console.error('Login Failed', err);
 //     }
 //   })
// }

}