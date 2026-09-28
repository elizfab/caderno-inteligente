import { Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BackButtonComponent } from '../../back-button/back-button';
import { CreateStudyItemDto, StudyStatus, StudyTableItem, UpdateStudyItemDto } from '../../../types/content-template.interface';
import { ContentItemService } from '../../../../core/services/content/content-item.service';
import { HeaderActionsService } from '../../../../core/services/header-actions/header-actions.service';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-study-detail-template',
  standalone: true,
  imports: [
    BackButtonComponent,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    RouterLink,
    TableModule,
    TagModule, Icon],
  templateUrl: './study-detail-template.html',
  styleUrl: './study-detail-template.scss',
})
export class StudyDetailTemplate implements OnInit, OnDestroy {
  @Input({ required: true }) pageTitle = '';
  @Input({ required: true }) pageDescription = '';
  @Input() createButtonLabel = 'Cadastrar item';
  @Input() accentColor = '#4f46e5';
  @Input({ required: true }) section = '';
  @Input({ required: true }) topic = '';

  items = signal<StudyTableItem[]>([]);
  loading = signal(false);
  saving = signal(false);

  modalVisible = false;
  editingItem: StudyTableItem | null = null;

  form = {
    courseName: '',
    status: 'Não iniciado' as StudyStatus,
    date: '',
    url: '',
  };

  private readonly headerActions = inject(HeaderActionsService);

  constructor(private studyItemService: ContentItemService) {}

  ngOnInit(): void {
    // Registra o botão "Novo conteúdo de estudo" no header global.
    this.headerActions.set([
      {
        id: 'novo-conteudo-estudo',
        label: this.createButtonLabel,
        icon: 'plus',
        variant: 'accent',
        run: () => this.openCreateModal(),
      },
    ]);
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.headerActions.clear();
  }

  loadItems(): void {
    if (!this.section || !this.topic) return;
    this.loading.set(true);
    this.studyItemService.list(this.section, this.topic).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreateModal(): void {
    this.editingItem = null;
    this.form = { courseName: '', status: 'Não iniciado', date: '', url: '' };
    this.modalVisible = true;
  }

  openEditModal(item: StudyTableItem): void {
    this.editingItem = item;
    this.form = { courseName: item.courseName, status: item.status, date: item.date, url: item.url };
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.editingItem = null;
  }

  saveItem(): void {
    this.saving.set(true);

    if (this.editingItem) {
      const dto: UpdateStudyItemDto = { ...this.form };
      this.studyItemService.update(this.editingItem.id, dto).subscribe({
        next: (updated) => {
          this.items.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
          this.saving.set(false);
          this.closeModal();
        },
        error: () => this.saving.set(false),
      });
    } else {
      const dto: CreateStudyItemDto = { section: this.section, topic: this.topic, ...this.form };
      this.studyItemService.create(dto).subscribe({
        next: (created) => {
          this.items.update((list) => [...list, created]);
          this.saving.set(false);
          this.closeModal();
        },
        error: () => this.saving.set(false),
      });
    }
  }

  deleteItem(item: StudyTableItem): void {
    this.studyItemService.delete(item.id).subscribe({
      next: () => this.items.update((list) => list.filter((i) => i.id !== item.id)),
    });
  }

  courseDetailRoute(item: StudyTableItem): string {
    return `/${this.section}/${this.topic}/${item.id}`;
  }

  getStatusSeverity(status: StudyStatus): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<StudyStatus, 'success' | 'info' | 'warn' | 'danger'> = {
      Concluído: 'success',
      'Em andamento': 'info',
      'Não iniciado': 'warn',
      Pausado: 'danger',
    };
    return map[status];
  }
}
