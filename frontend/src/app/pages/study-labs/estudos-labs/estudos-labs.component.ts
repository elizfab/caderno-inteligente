import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { StudyCardGrid } from '../../../shared/components/study/study-card-grid/study-card-grid';
import { Icon } from '../../../shared/components/icon/icon';
import { StudyCardItem } from '../../../shared/types/content-template.interface';
import {
  CourseSection,
  CreateCourseSectionDto,
  UpdateCourseSectionDto,
} from '../../../shared/types/course.interface';
import { CourseSectionService } from '../../../core/services/course/course-section.service';
import { HeaderActionsService } from '../../../core/services/header-actions/header-actions.service';

@Component({
  selector: 'app-estudos-labs',
  standalone: true,
  imports: [StudyCardGrid, ButtonModule, DialogModule, FormsModule, InputTextModule, TooltipModule, Icon],
  templateUrl: './estudos-labs.component.html',
  styleUrl: './estudos-labs.component.scss',
})
export class EstudosLabsComponent implements OnInit, OnDestroy {
  readonly pageTitle = 'Estudos e Labs';
  readonly pageDescription =
    'Trilhas de estudo organizadas por área de conhecimento. Escolha uma categoria e comece a explorar.';

  private readonly headerActions = inject(HeaderActionsService);

  items = signal<StudyCardItem[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = '';

  modalVisible = false;
  editingSection: CourseSection | null = null;

  private rawSections: CourseSection[] = [];

  deleteModalVisible = false;
  deleteTargetId = '';
  deleteTargetName = '';

  form: CreateCourseSectionDto = this.emptyForm();

  constructor(private sectionService: CourseSectionService) {}

  ngOnInit(): void {
    this.loadSections();

    // Ação contextual exibida apenas nesta página, no header global.
    this.headerActions.set([
      {
        id: 'nova-area-estudo',
        label: 'Cadastrar nova área de estudo',
        icon: 'plus',
        variant: 'accent',
        run: () => this.openCreateModal(),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.headerActions.clear();
  }

  private emptyForm(): CreateCourseSectionDto {
    return {
      slug: '',
      name: '',
      description: '',
      bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      iconClass: 'book',
      imageUrl: '',
      active: true,
      order: 0,
    };
  }

  private loadSections(): void {
    this.loading.set(true);
    this.sectionService.list().subscribe({
      next: (sections) => {
        this.rawSections = sections;
        this.items.set(this.toCards(sections));
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      },
    });
  }

  private toCards(sections: CourseSection[]): StudyCardItem[] {
    return sections.map((s, i) => ({
      id: i + 1,
      apiId: s.id,
      title: s.name,
      description: s.description,
      bannerColor: s.bannerColor,
      iconClass: s.iconClass,
      skill: s.name,
      detailRoute: `/${s.slug}`,
      imageUrl: s.imageUrl || undefined,
    }));
  }

  openCreateModal(): void {
    this.editingSection = null;
    this.form = this.emptyForm();
    this.errorMessage = '';
    this.modalVisible = true;
  }

  openEditModal(section: CourseSection): void {
    this.editingSection = section;
    this.form = {
      slug: section.slug,
      name: section.name,
      description: section.description,
      bannerColor: section.bannerColor,
      iconClass: section.iconClass,
      imageUrl: section.imageUrl ?? '',
      active: section.active,
      order: section.order,
    };
    this.errorMessage = '';
    this.modalVisible = true;
  }

  saveSection(): void {
    if (!this.form.name || !this.form.slug) {
      this.errorMessage = 'Nome e slug são obrigatórios.';
      return;
    }
    this.saving.set(true);
    this.errorMessage = '';
    const obs = this.editingSection
      ? this.sectionService.update(this.editingSection.id, this.form as UpdateCourseSectionDto)
      : this.sectionService.create(this.form);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalVisible = false;
        this.loadSections();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage = err?.error?.error ?? err?.message ?? 'Erro ao salvar.';
      },
    });
  }

  cancelModal(): void {
    this.modalVisible = false;
    this.errorMessage = '';
  }

  onEditRequest(item: StudyCardItem): void {
    const section = this.rawSections.find((s) => s.id === item.apiId);
    if (section) this.openEditModal(section);
  }

  onDeleteRequest(item: StudyCardItem): void {
    this.deleteTargetId = item.apiId ?? '';
    this.deleteTargetName = item.title;
    this.deleteModalVisible = true;
  }

  confirmDelete(): void {
    if (!this.deleteTargetId) {
      this.deleteModalVisible = false;
      return;
    }
    this.sectionService.delete(this.deleteTargetId).subscribe({
      next: () => {
        this.deleteModalVisible = false;
        this.loadSections();
      },
      error: () => {
        this.deleteModalVisible = false;
      },
    });
  }

  cancelDelete(): void {
    this.deleteModalVisible = false;
    this.deleteTargetId = '';
    this.deleteTargetName = '';
  }
}
