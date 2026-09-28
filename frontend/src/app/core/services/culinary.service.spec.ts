import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CulinaryService } from './culinary.service';

describe('CulinaryService', () => {
  let service: CulinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CulinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
