import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth/auth.service';
import { Icon } from '../../shared/components/icon/icon';
import { RegisterModal } from '../../shared/components/register-modal/register-modal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, Icon, RegisterModal],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  private returnUrl = '/dashboard';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  submit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Informe e-mail e senha.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.error ?? err?.message ?? 'Não foi possível entrar. Tente novamente.',
        );
      },
    });
  }
}
