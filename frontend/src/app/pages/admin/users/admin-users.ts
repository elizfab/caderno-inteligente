import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../../core/services/user/user.service';
import { AuthUser, UserStats, UserStatus } from '../../../shared/types/auth.interface';
import { Icon } from '../../../shared/components/icon/icon';

type ActionType = 'approve' | 'block' | 'unblock' | 'delete';
interface PendingAction {
  type: ActionType;
  user: AuthUser;
}
interface StatusOption {
  label: string;
  value: UserStatus | 'all';
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TooltipModule,
    Icon,
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private readonly service = inject(UserService);

  readonly loading = signal(false);
  readonly processing = signal(false);
  readonly users = signal<AuthUser[]>([]);
  readonly stats = signal<UserStats>({ total: 0, active: 0, pending: 0, blocked: 0 });
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly statusFilter = signal<UserStatus | 'all'>('all');
  readonly pending = signal<PendingAction | null>(null);

  readonly statusOptions: StatusOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Ativos', value: 'active' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Bloqueados', value: 'blocked' },
  ];

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    const status = this.statusFilter();
    return this.users().filter((u) => {
      const matchStatus = status === 'all' || u.status === status;
      const matchTerm =
        !term ||
        (u.name ?? '').toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term);
      return matchStatus && matchTerm;
    });
  });

  readonly confirmTitle = computed(() => {
    switch (this.pending()?.type) {
      case 'approve':
        return 'Aprovar usuário';
      case 'block':
        return 'Bloquear usuário';
      case 'unblock':
        return 'Desbloquear usuário';
      case 'delete':
        return 'Excluir usuário';
      default:
        return '';
    }
  });

  readonly confirmMessage = computed(() => {
    const p = this.pending();
    if (!p) return '';
    const who = p.user.name || p.user.email;
    switch (p.type) {
      case 'approve':
        return `Deseja liberar o acesso de "${who}" ao sistema?`;
      case 'block':
        return `Deseja bloquear o acesso de "${who}"?`;
      case 'unblock':
        return `Deseja reativar o acesso de "${who}"?`;
      case 'delete':
        return `Esta ação é irreversível. Excluir "${who}"?`;
      default:
        return '';
    }
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.list().subscribe({
      next: (list) => {
        this.users.set(list ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.error ?? 'Falha ao carregar usuários.');
        this.loading.set(false);
      },
    });
    this.service.stats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => void 0,
    });
  }

  statusSeverity(status?: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warn';
      case 'blocked':
        return 'danger';
      default:
        return 'info';
    }
  }

  statusLabel(status?: string): string {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'blocked':
        return 'Bloqueado';
      default:
        return status ?? '—';
    }
  }

  initials(name?: string): string {
    return (name ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }

  ask(type: ActionType, user: AuthUser): void {
    this.pending.set({ type, user });
  }

  cancel(): void {
    this.pending.set(null);
  }

  confirm(): void {
    const action = this.pending();
    if (!action) return;
    this.processing.set(true);
    const id = action.user.id;
    const done = () => {
      this.processing.set(false);
      this.pending.set(null);
      this.reload();
    };
    const fail = (err: { error?: { error?: string } }) => {
      this.processing.set(false);
      this.pending.set(null);
      this.errorMessage.set(err?.error?.error ?? 'Não foi possível concluir a ação.');
    };

    switch (action.type) {
      case 'approve':
        this.service.approve(id).subscribe({ next: done, error: fail });
        break;
      case 'block':
        this.service.block(id).subscribe({ next: done, error: fail });
        break;
      case 'unblock':
        this.service.unblock(id).subscribe({ next: done, error: fail });
        break;
      case 'delete':
        this.service.remove(id).subscribe({ next: done, error: fail });
        break;
    }
  }
}
