import { TestBed } from '@angular/core/testing';

import { Comprobantes } from './comprobantes';

describe('Comprobantes', () => {
  let service: Comprobantes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comprobantes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
