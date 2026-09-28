import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuditLog, AuthUser, UserStats } from '../../../shared/types/auth.interface';

/**
 * Consome os endpoints administrativos de usuários (/api/v1/admin/*).
 * Todas as rotas exigem um usuário autenticado com perfil admin no backend.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  list(): Observable<AuthUser[]> {
    return this.api.get<AuthUser[]>('/api/v1/admin/users');
  }

  stats(): Observable<UserStats> {
    return this.api.get<UserStats>('/api/v1/admin/users/stats');
  }

  get(id: string): Observable<AuthUser> {
    return this.api.get<AuthUser>(`/api/v1/admin/users/${id}`);
  }

  approve(id: string): Observable<AuthUser> {
    return this.api.post<AuthUser>(`/api/v1/admin/users/${id}/approve`, {});
  }

  block(id: string): Observable<AuthUser> {
    return this.api.post<AuthUser>(`/api/v1/admin/users/${id}/block`, {});
  }

  unblock(id: string): Observable<AuthUser> {
    return this.api.post<AuthUser>(`/api/v1/admin/users/${id}/unblock`, {});
  }

  remove(id: string): Observable<unknown> {
    return this.api.delete<unknown>(`/api/v1/admin/users/${id}`);
  }

  audit(): Observable<AuditLog[]> {
    return this.api.get<AuditLog[]>('/api/v1/admin/audit');
  }
}
