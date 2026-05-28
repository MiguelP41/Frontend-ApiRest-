import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMembresia } from './form-membresia';

describe('FormMembresia', () => {
  let component: FormMembresia;
  let fixture: ComponentFixture<FormMembresia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMembresia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMembresia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
