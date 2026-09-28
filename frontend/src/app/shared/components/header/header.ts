import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbService } from '../../../core/services/Breadcrumb/breadcrumb.service';
import { HeaderActionsService } from '../../../core/services/header-actions/header-actions.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { Icon } from '../icon/icon';

/**
 * Header global. Exibe o título da página (via BreadcrumbService),
 * as ações contextuais registradas pela página atual
 * (via HeaderActionsService) e o usuário logado.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, TooltipModule, Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly breadcrumbService = inject(BreadcrumbService);
  readonly headerActions = inject(HeaderActionsService);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  readonly userInitials = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });
}
