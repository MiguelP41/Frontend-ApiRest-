import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth';

type UserRole = 'ROLE_Jefe' | 'ROLE_Empleado';

export const adminRoleGuard: CanActivateFn = (route, state) => {

  const authService = inject(Auth);
  const router = inject(Router);


  if (!authService.isAuthenticated()) {
    return router.navigate(['/login']);
  }


  const requiredRole: UserRole = 'ROLE_Jefe';
  const userRole = authService.getRole();

  if (userRole === requiredRole) {
    // Está autenticado y tiene el rol correcto.
    return true; 
  } else {
    // Está autenticado, pero NO tiene el rol de cliente.
    console.warn(`Acceso denegado. Rol esperado: ${requiredRole}. Rol actual: ${userRole}`);
    // Lo enviamos a la ruta administrativa, ya que es el otro dashboard principal.
    return router.navigate(['/Client1']); 
  }
};
