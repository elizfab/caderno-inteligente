import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Restringe rotas administrativas a usuários com perfil "admin".
 * Sem sessão → redireciona para /login; autenticado sem permissão → /dashboard.
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  if (!auth.isAdmin()) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
