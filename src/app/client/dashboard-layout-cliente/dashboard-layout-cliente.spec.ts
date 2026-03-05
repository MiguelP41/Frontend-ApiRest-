import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutCliente } from './dashboard-layout-cliente';

describe('DashboardLayout', () => {
  let component: DashboardLayoutCliente;
  let fixture: ComponentFixture<DashboardLayoutCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayoutCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
