import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CreateStudyItemDto,
  StudyStatus,
  StudyTableItem,
} from '../../shared/types/content-template.interface';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SectionConfig, STUDY_SECTIONS, TopicConfig } from '../../core/constants/panel-topics';
import { ContentItemService } from '../../core/services/content/content-item.service';
import { HeaderActionsService } from '../../core/services/header-actions/header-actions.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonModule,
    ChartModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ProgressBarModule,
    TagModule,
    CardModule,
    TableModule,
    Icon,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  readonly sections = STUDY_SECTIONS;

  private readonly headerActions = inject(HeaderActionsService);
  private readonly auth = inject(AuthService);

  items = signal<StudyTableItem[]>([]);
  loading = signal(true);

  readonly firstName = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ')[0] || 'de volta';
  });

  readonly today = new Date();

  get totalItems(): number {
    return this.items().length;
  }
  get inProgressItems(): number {
    return this.items().filter((i) => i.status === 'Em andamento').length;
  }
  get completedItems(): number {
    return this.items().filter((i) => i.status === 'Concluído').length;
  }
  get notStartedItems(): number {
    return this.items().filter((i) => i.status === 'Não iniciado').length;
  }
  get activeSections(): number {
    return new Set(this.items().map((i) => i.section)).size;
  }
  get completionRate(): number {
    if (!this.totalItems) return 0;
    return Math.round((this.completedItems / this.totalItems) * 100);
  }

  /** Últimos itens cadastrados/atualizados — alimenta a tabela de atividade. */
  readonly recentItems = computed<StudyTableItem[]>(() =>
    [...this.items()]
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      .slice(0, 8),
  );

  /** Ranking de seções por quantidade de cursos. */
  readonly topSections = computed(() => {
    const counts = new Map<string, number>();
    for (const item of this.items()) {
      counts.set(item.section, (counts.get(item.section) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([slug, count]) => ({
        slug,
        count,
        label: this.sections.find((s) => s.slug === slug)?.label ?? slug,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  // ── Charts ─────────────────────────────────────────────────────────────────
  statusChartData: any = null;
  evolutionChartData: any = null;

  readonly statusChartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, boxWidth: 12, font: { size: 12 } } },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
  };

  readonly evolutionChartOptions = {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { size: 11 } },
        grid: { color: '#f3f4f6' },
      },
    },
  };

  // ── Section stats helpers ──────────────────────────────────────────────────
  getSectionItems(sectionSlug: string): StudyTableItem[] {
    return this.items().filter((i) => i.section === sectionSlug);
  }

  getSectionProgress(sectionSlug: string): number {
    const list = this.getSectionItems(sectionSlug);
    if (!list.length) return 0;
    return Math.round((list.filter((i) => i.status === 'Concluído').length / list.length) * 100);
  }

  getSectionAccent(section: SectionConfig): string {
    const match = section.bannerColor.match(/#[0-9a-fA-F]{6}/);
    return match?.[0] ?? '#4f46e5';
  }

  getSectionLabel(slug: string): string {
    return this.sections.find((s) => s.slug === slug)?.label ?? slug;
  }

  getTopics(sectionSlug: string): TopicConfig[] {
    return this.sections.find((s) => s.slug === sectionSlug)?.topics ?? [];
  }

  getStatusSeverity(status: StudyStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<StudyStatus, 'success' | 'info' | 'warn' | 'danger'> = {
      Concluído: 'success',
      'Em andamento': 'info',
      'Não iniciado': 'warn',
      Pausado: 'danger',
    };
    return map[status];
  }

  // ── Quick-add modal ────────────────────────────────────────────────────────
  addModalVisible = false;
  saving = signal(false);
  selectedSection: SectionConfig | null = null;
  availableTopics: TopicConfig[] = [];

  addForm: CreateStudyItemDto = this.emptyForm();

  readonly statusOptions: StudyStatus[] = ['Não iniciado', 'Em andamento', 'Concluído', 'Pausado'];

  private emptyForm(): CreateStudyItemDto {
    return {
      section: '',
      topic: '',
      courseName: '',
      status: 'Não iniciado',
      date: new Date().toISOString().slice(0, 10),
      url: '',
    };
  }

  openAddModal(section?: SectionConfig): void {
    this.selectedSection = section ?? null;
    this.addForm = { ...this.emptyForm(), section: section?.slug ?? '' };
    this.availableTopics = section?.topics ?? [];
    this.addModalVisible = true;
  }

  onSectionChange(): void {
    const sec = this.sections.find((s) => s.slug === this.addForm.section);
    this.selectedSection = sec ?? null;
    this.availableTopics = sec?.topics ?? [];
    this.addForm.topic = '';
  }

  saveItem(): void {
    if (!this.addForm.section || !this.addForm.topic || !this.addForm.courseName) return;
    this.saving.set(true);

    this.contentItemService.create(this.addForm).subscribe({
      next: (item) => {
        this.items.update((list) => [item, ...list]);
        this.buildCharts();
        this.saving.set(false);
        this.addModalVisible = false;
      },
      error: () => this.saving.set(false),
    });
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  constructor(
    private contentItemService: ContentItemService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.headerActions.set([
      {
        id: 'adicionar-curso',
        label: 'Adicionar curso',
        icon: 'plus',
        variant: 'accent',
        run: () => this.openAddModal(),
      },
    ]);

    this.contentItemService.listAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.buildCharts();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    this.headerActions.clear();
  }

  private buildCharts(): void {
    const items = this.items();

    // Status doughnut
    const statusCounts: Record<StudyStatus, number> = {
      'Não iniciado': 0,
      'Em andamento': 0,
      Concluído: 0,
      Pausado: 0,
    };
    items.forEach((i) => {
      statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1;
    });

    this.statusChartData = {
      labels: ['Não iniciado', 'Em andamento', 'Concluído', 'Pausado'],
      datasets: [
        {
          data: [
            statusCounts['Não iniciado'],
            statusCounts['Em andamento'],
            statusCounts['Concluído'],
            statusCounts['Pausado'],
          ],
          backgroundColor: ['#e5e7eb', '#3b82f6', '#22c55e', '#f59e0b'],
          borderWidth: 0,
        },
      ],
    };

    // Evolution line — items by month (last 6 months)
    const monthLabels: string[] = [];
    const monthCounts: number[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }));

      const count = items.filter((item) => {
        if (!item.createdAt) return false;
        const created = new Date(item.createdAt);
        return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
      }).length;
      monthCounts.push(count);
    }

    this.evolutionChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Cursos cadastrados',
          data: monthCounts,
          backgroundColor: 'rgba(79,70,229,0.15)',
          borderColor: '#4f46e5',
          borderWidth: 2,
          borderRadius: 6,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4f46e5',
          pointRadius: 4,
        },
      ],
    };
  }

  navigateToSection(sectionSlug: string): void {
    this.router.navigate([sectionSlug]);
  }

  openItem(item: StudyTableItem): void {
    if (item.detailRoute) {
      this.router.navigateByUrl(item.detailRoute);
    }
  }
}
