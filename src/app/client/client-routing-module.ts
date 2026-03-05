import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutCliente } from './dashboard-layout-cliente/dashboard-layout-cliente';

const routes: Routes = [
  {
    // RUTA INTERNA: 'Dasboard'
    // La URL completa será: /client/Dasboard
    path: 'Dasboard', 
    component: DashboardLayoutCliente, // <-- Componente que se carga
    children: [
      // Aquí irán las sub-rutas anidadas dentro del layout, como /client/Dasboard/perfil
      // { path: 'perfil', component: PerfilClienteComponent }
    ]
  },
  {
    // Redirigir de /client a /client/Dasboard
    path: '', 
    redirectTo: 'Dasboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
