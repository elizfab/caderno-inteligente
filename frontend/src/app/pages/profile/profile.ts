import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthUser } from '../../shared/types/auth.interface';
import { Icon } from '../../shared/components/icon/icon';

const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule, Icon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;
  readonly loading = signal(false);
  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly profileMessage = signal('');
  readonly profileError = signal('');
  readonly passwordMessage = signal('');
  readonly passwordError = signal('');
  readonly avatarPreview = signal('');

  name = '';
  phone = '';
  email = '';
  private avatarData = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    const current = this.user();
    if (current) this.hydrate(current);

    this.loading.set(true);
    this.auth.loadProfile().subscribe({
      next: (u) => {
        this.hydrate(u);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      this.profileError.set('Avatar deve ser PNG, JPG, JPEG ou WebP.');
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

  saveProfile(): void {
    this.profileError.set('');
    this.profileMessage.set('');
    if (!this.name.trim()) {
      this.profileError.set('O nome é obrigatório.');
      return;
    }
    this.savingProfile.set(true);
    this.auth
      .updateProfile({
        name: this.name.trim(),
        phone: this.phone,
        avatarUrl: this.avatarData || undefined,
      })
      .subscribe({
        next: () => {
          this.savingProfile.set(false);
          this.profileMessage.set('Perfil atualizado com sucesso.');
        },
        error: (err) => {
          this.savingProfile.set(false);
          this.profileError.set(err?.error?.error ?? 'Não foi possível salvar o perfil.');
        },
      });
  }

  changePassword(): void {
    this.passwordError.set('');
    this.passwordMessage.set('');
    if (!this.currentPassword || !this.newPassword) {
      this.passwordError.set('Informe a senha atual e a nova senha.');
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError.set('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('A confirmação não confere.');
      return;
    }
    this.savingPassword.set(true);
    this.auth
      .changePassword({ currentPassword: this.currentPassword, newPassword: this.newPassword })
      .subscribe({
        next: () => {
          this.savingPassword.set(false);
          this.passwordMessage.set('Senha alterada com sucesso.');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => {
          this.savingPassword.set(false);
          this.passwordError.set(err?.error?.error ?? 'Não foi possível alterar a senha.');
        },
      });
  }

  private hydrate(u: AuthUser): void {
    this.name = u.name ?? '';
    this.phone = u.phone ?? '';
    this.email = u.email ?? '';
    if (u.avatarUrl) this.avatarPreview.set(u.avatarUrl);
  }
}
