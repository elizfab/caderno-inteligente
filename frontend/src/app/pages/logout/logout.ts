import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth/auth.service';
import { Icon } from '../../shared/components/icon/icon';

/**
 * Página de logout: encerra a sessão imediatamente ao ser aberta e
 * oferece um atalho para entrar novamente.
 */
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [ButtonModule, RouterLink, Icon],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly done = signal(false);

  ngOnInit(): void {
    this.auth.logout().subscribe({
      next: () => this.done.set(true),
      error: () => this.done.set(true),
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
