import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing-module';
import { DashboardLayoutCliente } from './dashboard-layout-cliente/dashboard-layout-cliente';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    DashboardLayoutCliente
  ]
})
export class ClientModule { }
