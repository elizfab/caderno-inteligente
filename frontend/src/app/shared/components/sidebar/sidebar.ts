import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SidebarItem, SidebarItemKey } from '../../types/sidebar.interface';
import { Icon } from '../icon/icon';

const SECTION_PREFIXES: Record<SidebarItemKey, string[]> = {
  dashboard: ['/dashboard'],
  'estudos-labs': [
    '/estudos-labs',
    '/backend',
    '/banco-de-dados',
    '/cloud',
    '/containers-kubernetes',
    '/devops',
    '/frontend',
    '/inteligencia-artificial',
    '/observability',
    '/performance-engineering',
  ],
  projetos: ['/projetos', '/rollout-service'],
  'vida-criativa': ['/vida-criativa'],
  'painel-financeiro': ['/painel-financeiro'],
  culinaria: ['/culinaria'],
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  @Input() expanded = true;
  @Output() toggleExpanded = new EventEmitter<void>();

  activeItem: SidebarItemKey = 'dashboard';

  private sub = new Subscription();

  readonly items: SidebarItem[] = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', iconClass: 'layout-dashboard' },
    { key: 'estudos-labs', label: 'Estudos e Labs', href: '/estudos-labs', iconClass: 'book' },
    { key: 'projetos', label: 'Projetos', href: '/projetos', iconClass: 'folder' },
    // { key: 'vida-criativa', label: 'Vida Criativa', href: '/vida-criativa', iconClass: 'palette' },
    // { key: 'painel-financeiro', label: 'Painel Financeiro', href: '/painel-financeiro', iconClass: 'chart-column' },
    // { key: 'culinaria', label: 'Culinária', href: '/culinaria', iconClass: 'utensils' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActive(this.router.url);

    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => this.updateActive(e.urlAfterRedirects)),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private updateActive(url: string): void {
    const firstSegment = '/' + (url.split('?')[0].split('/').filter(Boolean)[0] ?? '');

    for (const [key, prefixes] of Object.entries(SECTION_PREFIXES)) {
      if (prefixes.includes(firstSegment)) {
        this.activeItem = key as SidebarItemKey;
        return;
      }
    }
    this.activeItem = 'dashboard';
  }

  get sidebarWidth(): string {
    return this.expanded ? 'var(--sidebar-width-expanded)' : 'var(--sidebar-width-collapsed)';
  }
}
