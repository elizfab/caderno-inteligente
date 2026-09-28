import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Icon } from '../icon/icon';

const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * Modal de cadastro de usuário. Abre a partir do botão "Criar conta" no login.
 * O novo usuário fica pendente de aprovação (regra do backend).
 */
@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule, InputTextModule, PasswordModule, Icon],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.scss',
})
export class RegisterModal {
  @Output() registered = new EventEmitter<void>();

  private readonly auth = inject(AuthService);

  readonly visible = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly avatarPreview = signal<string>('');

  name = '';
  phone = '';
  email = '';
  password = '';
  confirmPassword = '';
  private avatarData = '';

  open(): void {
    this.reset();
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      this.errorMessage.set('Avatar deve ser PNG, JPG, JPEG ou WebP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.avatarData = result;
      this.avatarPreview.set(result);
    };
    reader.readAsDataURL(file);
  }

  onPhoneInput(): void {
    const digits = this.phone.replace(/\D/g, '').slice(0, 11);
    let out = digits;
    if (digits.length > 2) out = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) {
      out = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    this.phone = out;
  }

  submit(): void {
    this.errorMessage.set('');
    if (!this.name.trim() || !this.email.trim() || !this.password) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMessage.set('E-mail inválido.');
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage.set('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('As senhas não conferem.');
      return;
    }

    this.saving.set(true);
    this.auth
      .register({
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone,
        password: this.password,
        avatarUrl: this.avatarData || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set(
            'Cadastro realizado! Aguardando aprovação do administrador. Você poderá entrar quando seu acesso for liberado.',
          );
          this.registered.emit();
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(
            err?.error?.error ?? 'Não foi possível concluir o cadastro. Tente novamente.',
          );
        },
      });
  }

  private reset(): void {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.avatarData = '';
    this.avatarPreview.set('');
    this.errorMessage.set('');
    this.successMessage.set('');
    this.saving.set(false);
  }
}
