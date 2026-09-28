import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle between light and dark', () => {
    service.set('light');
    expect(service.mode()).toBe('light');
    service.toggle();
    expect(service.mode()).toBe('dark');
    service.toggle();
    expect(service.mode()).toBe('light');
  });
});
