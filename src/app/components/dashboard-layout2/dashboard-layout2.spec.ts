import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayout2 } from './dashboard-layout2';

describe('DashboardLayout2', () => {
  let component: DashboardLayout2;
  let fixture: ComponentFixture<DashboardLayout2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayout2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLayout2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
