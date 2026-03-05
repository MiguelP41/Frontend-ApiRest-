import { TestBed } from '@angular/core/testing';

import { NavbarComunicacion } from './navbar-comunicacion';

describe('NavbarComunicacion', () => {
  let service: NavbarComunicacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarComunicacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
