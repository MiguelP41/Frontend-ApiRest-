import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { clientRoleGuard } from './core/guards/client-role-guard'; 
import { adminRoleGuard } from './core/guards/admin-role-guard';

export const routes: Routes = [

 {
    path:'login',
    loadComponent:()=> import('./components/login/login').then(m => m.LoginComponent),
    canActivate:[authenticatedGuard],
    
 } ,

 {
    path:'body',
    loadComponent:()=> import('./components/body/body').then(m => m.Body),
    canActivate : [authGuard],
  },

  /*{
    path:'prueba',
    loadComponent:()=> import('./client/dashboard-layout-cliente/dashboard-layout-cliente').then(m => m.DashboardLayoutCliente),
    canActivate : [authGuard],
  },*/
  {
    path: 'Client', // <--- Nueva ruta de entrada, más clara
    loadChildren: () => import('./client/client-module').then(m => m.ClientModule),
    canActivate : [clientRoleGuard],
  },

  {
    path:'Dasboard',
    loadComponent:()=> import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
    canActivate : [adminRoleGuard],
    children: [
    {
      path: 'pacientes', // La ruta completa será /Dasboard/patients
      loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
      canActivate : [authGuard]
    },
    {
        path: 'ClientesAdmin', // Ruta de clientes (localhost:4200/Dasboard/ClientesAdmin)
        loadComponent: () => import('./components/dashboard-layout2/dashboard-layout2').then(m => m.DashboardLayout),
      },

      {
      path: '', // <--- Esto significa: "Si la ruta es solo /Dasboard..."
      loadComponent: () => import('./components/body/body').then(m => m.Body) // "...entonces muestra el Body"
    },
    
  ]
  },

  {
    path:'',
    loadComponent:()=> import('./components/login/login').then(m => m.LoginComponent),
    canActivate:[authenticatedGuard],

  }

  

 
];

