import { Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { BreadcrumbItem } from '../../types/breadcrumb.interface';
import { filter, Subscription } from 'rxjs';
import { BreadcrumbService } from '../../../core/services/Breadcrumb/breadcrumb.service';
import { getSectionBySlug, getTopicBySlug } from '../../../core/constants/panel-topics';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs implements OnInit, OnDestroy {
  private readonly baseItems = signal<BreadcrumbItem[]>([]);

  readonly items = computed<BreadcrumbItem[]>(() => {
    const base = this.baseItems();
    const extra = this.breadcrumbService.extra();
    return extra ? [...base, extra] : base;
  });

  readonly isHidden = computed(() => this.breadcrumbService.hidden());

  private sub = new Subscription();

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    // O título da página (mostrado no header como "Caderno Inteligente | <página>")
    // é sempre o último item da trilha de breadcrumbs. Mantido reativo aqui.
    effect(() => {
      const list = this.items();
      const last = list.length ? list[list.length - 1].label : null;
      this.breadcrumbService.setPageTitle(last);
    });
  }

  ngOnInit(): void {
    this.build(this.router.url);

    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => this.build(e.urlAfterRedirects)),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private build(rawUrl: string): void {
    const url = rawUrl.split('?')[0];
    const segments = url.split('/').filter(Boolean);

    if (segments.length === 0 || segments[0] === 'dashboard') {
      this.baseItems.set([]);
      return;
    }

    const items: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];
    const sectionSlug = segments[0];

    // /estudos-labs
    if (sectionSlug === 'estudos-labs') {
      items.push({ label: 'Estudos e Labs' });
      this.baseItems.set(items);
      return;
    }

    // Seções de estudo (backend, frontend, cloud, banco-de-dados, ...)
    const section = getSectionBySlug(sectionSlug);
    if (section) {
      // Hierarquia: Dashboard > Estudos e Labs > <Seção> > <Tópico> (ver WIP.md)
      items.push({ label: 'Estudos e Labs', href: '/estudos-labs' });

      const hasMore = segments.length > 1;
      items.push({ label: section.label, href: hasMore ? '/' + sectionSlug : undefined });

      if (segments[1]) {
        const topic = getTopicBySlug(sectionSlug, segments[1]);
        const topicLabel = topic?.label ?? this.titleCase(segments[1]);
        const hasItem = segments.length > 2;
        items.push({
          label: topicLabel,
          href: hasItem ? `/${sectionSlug}/${segments[1]}` : undefined,
        });
      }
      this.baseItems.set(items);
      return;
    }

    // Demais seções conhecidas (projetos, culinária, admin, perfil, ...)
    const labels: Record<string, string> = {
      projetos: 'Projetos',
      pessoais: 'Pessoais',
      profissionais: 'Profissionais',
      culinaria: 'Culinária',
      'vida-criativa': 'Vida Criativa',
      'painel-financeiro': 'Painel Financeiro',
      settings: 'Configurações',
      perfil: 'Meu Perfil',
      admin: 'Administração',
      usuarios: 'Usuários',
    };
    const routable = new Set(['/projetos', '/culinaria']);

    segments.forEach((seg, i) => {
      const path = '/' + segments.slice(0, i + 1).join('/');
      const last = i === segments.length - 1;
      const label = labels[seg] ?? this.titleCase(seg);
      items.push({ label, href: !last && routable.has(path) ? path : undefined });
    });
    this.baseItems.set(items);
  }

  private titleCase(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
