import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
  });

  const run = () =>
    TestBed.runInInjectionContext(() =>
      adminGuard(
        {} as ActivatedRouteSnapshot,
        { url: '/admin/usuarios' } as RouterStateSnapshot,
      ),
    );

  it('should redirect (UrlTree) to login when unauthenticated', () => {
    const result = run();
    expect(result instanceof UrlTree).toBe(true);
  });
});
