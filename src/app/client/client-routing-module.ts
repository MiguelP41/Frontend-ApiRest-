import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutCliente } from './dashboard-layout-cliente/dashboard-layout-cliente';
import { Categorias } from '../services/categorias';


const routes: Routes = [
  {
    path: 'Dasboard', 
    component: DashboardLayoutCliente, 
    children: [
      {
        path: 'nuevo-pago',
        loadComponent: () => import('./form-categoria/form-categoria')
            .then(m => m.FormCategoriaComponent)
      },
      {
        path: '',
        redirectTo: 'nuevo-pago',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',  // ← Esto falta
    redirectTo: 'Dasboard/nuevo-pago',
    pathMatch: 'full'
  }
];
  
  /*{
    // Redirigir de /client a /client/Dasboard
    path: '', 
    redirectTo: 'Dasboard',
    pathMatch: 'full'
  }*/








@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
