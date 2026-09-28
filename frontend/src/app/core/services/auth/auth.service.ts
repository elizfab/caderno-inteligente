import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiResponse } from '../../../shared/types/api-response.interface';
import {
  AuthSession,
  AuthUser,
  ChangePasswordDto,
  LoginDto,
  ProfileDto,
  RegisterDto,
} from '../../../shared/types/auth.interface';

const STORAGE_KEY = 'techbook.session';

/**
 * Serviço de autenticação baseado em signals.
 * A sessão (JWT + usuário) é persistida em localStorage e restaurada
 * na inicialização. Todo acesso ao storage é protegido para SSR.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiUrl}/api/v1/auth`;
  private readonly apiBase = `${environment.apiUrl}/api/v1`;

  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly currentUser = computed<AuthUser | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed<boolean>(() => {
    const s = this.session();
    if (!s?.token) return false;
    return new Date(s.expiresAt).getTime() > Date.now();
  });
  readonly isAdmin = computed<boolean>(() => this.currentUser()?.role === 'admin');

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  /** Cadastra um novo usuário (fica pendente de aprovação). */
  register(dto: RegisterDto): Observable<AuthUser> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.base}/register`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Resposta de cadastro inválida.');
        return res.data;
      }),
    );
  }

  /** Busca o perfil atualizado do usuário autenticado. */
  loadProfile(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.apiBase}/profile`).pipe(
      map((res) => {
        if (!res.data) throw new Error('Perfil inválido.');
        return res.data;
      }),
      tap((user) => this.patchUser(user)),
    );
  }

  /** Atualiza nome, telefone e avatar do próprio usuário. */
  updateProfile(dto: ProfileDto): Observable<AuthUser> {
    return this.http.put<ApiResponse<AuthUser>>(`${this.apiBase}/profile`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Perfil inválido.');
        return res.data;
      }),
      tap((user) => this.patchUser(user)),
    );
  }

  /** Troca a senha do usuário autenticado. */
  changePassword(dto: ChangePasswordDto): Observable<void> {
    return this.http
      .put<ApiResponse<unknown>>(`${this.apiBase}/profile/password`, dto)
      .pipe(map(() => void 0));
  }

  /** Atualiza o usuário na sessão em memória e no storage. */
  private patchUser(user: AuthUser): void {
    const s = this.session();
    if (!s) return;
    const updated: AuthSession = { ...s, user };
    this.session.set(updated);
    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  login(dto: LoginDto): Observable<AuthSession> {
    return this.http.post<ApiResponse<AuthSession>>(`${this.base}/login`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Resposta de login inválida.');
        return res.data;
      }),
      tap((session) => this.setSession(session)),
    );
  }

  /**
   * Encerra a sessão localmente e notifica o backend (best effort).
   */
  logout(): Observable<void> {
    const notify$ = this.token
      ? this.http.post(`${this.base}/logout`, {}).pipe(
          map(() => void 0),
          catchError(() => of(void 0)),
        )
      : of(void 0);

    return notify$.pipe(tap(() => this.clearSession()));
  }

  /** Limpa a sessão sem chamar o backend (usado pelo interceptor em 401). */
  clearSession(): void {
    this.session.set(null);
    if (this.hasStorage()) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  redirectToLogin(returnUrl?: string): void {
    this.router.navigate(['/login'], returnUrl ? { queryParams: { returnUrl } } : undefined);
  }

  private setSession(session: AuthSession): void {
    this.session.set(session);
    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }

  private restoreSession(): AuthSession | null {
    if (!this.hasStorage()) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as AuthSession;
      if (!session.token || new Date(session.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
