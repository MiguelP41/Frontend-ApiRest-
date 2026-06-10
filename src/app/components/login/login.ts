import { Component, ChangeDetectionStrategy, signal, output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


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
  private router = inject(Router);
  private authService = inject(Auth);
  private http = inject(HttpClient);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  mostrarPassword = signal(false); // 👈 Controla si muestra el campo contraseña
  rolDetectado = signal<string | null>(null); // 👈 Guarda el rol

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl(''),
    tipo_docu: new FormControl('V', Validators.required)
  });

  constructor() {}

  // Paso 1 — Verificar rol al salir del campo cédula
  verificarRol(): void {
    const { tipo_docu, username } = this.loginForm.getRawValue();
    if (!username) return;

    const usernameCompleto = tipo_docu + username;

    this.http.post<any>(`${environment.apiUrl}/check-rol`, { usuario: usernameCompleto })
      .subscribe({
        next: (res) => {
          this.rolDetectado.set(res.rol);
          if (res.rol === 'ROLE_Jefe') {
            this.mostrarPassword.set(true); // 👈 Muestra campo contraseña
          } else {
            this.mostrarPassword.set(false);
            this.login(); // 👈 Cliente entra directo
          }
        },
        error: () => {
          this.errorMessage.set('Usuario no encontrado.');
        }
      });
  }

  // Paso 2 — Login
  login(): void {
    const { tipo_docu, username, password } = this.loginForm.getRawValue();
    const usernameCompleto = tipo_docu! + username!;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(usernameCompleto!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        const userRole = this.authService.getRole();
        if (userRole === 'ROLE_Jefe') {
          this.router.navigate(['/Dasboard']);
        } else if (userRole === 'ROLE_Empleado') {
          this.router.navigate(['/Client/Dasboard/nuevo-pago']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales incorrectas.');
      }
    });
  }

  formatearCedula(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.loginForm.get('username')?.setValue(input.value, { emitEvent: false });
  }

}