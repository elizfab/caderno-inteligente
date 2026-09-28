import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Breadcrumbs } from './shared/components/breadcrumbs/breadcrumbs';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { HealthService } from './core/services/health/health.service';

type BackendStatus = 'checking' | 'online' | 'offline';

const AUTH_ROUTES = ['/login', '/logout'];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Breadcrumbs, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly healthService = inject(HealthService);
  private readonly router = inject(Router);

  readonly backendStatus = signal<BackendStatus>('checking');
  readonly sidebarExpanded = signal(false);
  readonly isAuthPage = signal(this.checkAuthPage(this.router.url));

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.isAuthPage.set(this.checkAuthPage(e.urlAfterRedirects)));

    this.healthService.check().subscribe({
      next: () => this.backendStatus.set('online'),
      error: () => this.backendStatus.set('offline'),
    });
  }

  toggleSidebar(): void {
    this.sidebarExpanded.update((v) => !v);
  }

  private checkAuthPage(url: string): boolean {
    const path = url.split('?')[0];
    return AUTH_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
  }
}
