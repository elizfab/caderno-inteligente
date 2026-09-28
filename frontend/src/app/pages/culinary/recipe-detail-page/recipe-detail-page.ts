import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DragDropModule } from 'primeng/dragdrop';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Icon } from '../../../shared/components/icon/icon';
import { HeaderActionsService } from '../../../core/services/header-actions/header-actions.service';
import {
  CulinaryCategory,
  CulinaryRecipe,
  UpdateCulinaryRecipeDto,
} from '../../../shared/types/culinaria.interface';
import { CulinaryService } from '../../../core/services/culinary.service';

@Component({
  selector: 'app-recipe-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    DragDropModule,
    AccordionModule,
    SelectModule,
    BackButtonComponent,
    Icon,
  ],
  templateUrl: './recipe-detail-page.html',
  styleUrl: './recipe-detail-page.scss',
})
export class RecipeDetailPageComponent implements OnInit, OnDestroy {
  private readonly headerActions = inject(HeaderActionsService);

  categorySlug = '';
  recipeSlug = '';

  category = signal<CulinaryCategory | null>(null);
  recipe = signal<CulinaryRecipe | null>(null);
  loading = signal(true);
  saving = signal(false);
  errorMessage = '';

  editModalVisible = false;

  difficultyOptions = [
    { label: 'Fácil', value: 'Fácil' },
    { label: 'Médio', value: 'Médio' },
    { label: 'Difícil', value: 'Difícil' },
  ];

  statusOptions = [
    { label: 'Pendente', value: 'pending' },
    { label: 'Testada', value: 'tested' },
    { label: 'Favorita', value: 'favorite' },
    { label: 'Precisa de ajustes', value: 'needs_adjustment' },
  ];

  editForm: UpdateCulinaryRecipeDto = this.emptyForm();

  ingredientsText = '';
  preparationText = '';
  tagsText = '';

  constructor(
    private route: ActivatedRoute,
    private culinaryService: CulinaryService,
  ) {}

  ngOnInit(): void {
    this.categorySlug = this.route.snapshot.paramMap.get('categorySlug') ?? '';
    this.recipeSlug = this.route.snapshot.paramMap.get('recipeSlug') ?? '';
    this.loadData();

    this.headerActions.set([
      {
        id: 'editar-receita',
        label: 'Editar receita',
        icon: 'pencil',
        variant: 'primary',
        tooltip: 'Editar esta receita',
        run: () => this.openEditModal(),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.headerActions.clear();
  }

  private emptyForm(): UpdateCulinaryRecipeDto {
    return {
      categoryId: '',
      categorySlug: '',
      name: '',
      slug: '',
      description: '',
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servingsStr: '',
      difficulty: 'Fácil',
      status: 'pending',
      tags: [],
      imageUrl: '',
      youtubeUrl: '',
      sourceUrl: '',
      ingredients: [],
      preparationSteps: [],
      utensils: '',
      tips: '',
      substitutions: '',
      storageInstructions: '',
      estimatedCost: 0,
      personalRating: 0,
      tested: false,
      notes: '',
      active: true,
    };
  }

  loadData(): void {
    this.loading.set(true);
    // Load categories to get category info
    this.culinaryService.listCategories().subscribe({
      next: (cats) => {
        this.category.set(cats.find((c) => c.slug === this.categorySlug) ?? null);
        // Load recipes and find by slug
        this.culinaryService.listRecipes(this.categorySlug).subscribe({
          next: (recipes) => {
            const recipe = recipes.find((r) => r.slug === this.recipeSlug) ?? null;
            this.recipe.set(recipe);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  openEditModal(): void {
    const r = this.recipe();
    if (!r) return;
    this.editForm = {
      categoryId: r.categoryId,
      categorySlug: r.categorySlug,
      name: r.name,
      slug: r.slug,
      description: r.description,
      prepTimeMinutes: r.prepTimeMinutes,
      cookTimeMinutes: r.cookTimeMinutes,
      servingsStr: r.servingsStr,
      difficulty: r.difficulty,
      status: r.status,
      tags: [...(r.tags ?? [])],
      imageUrl: r.imageUrl ?? '',
      youtubeUrl: r.youtubeUrl ?? '',
      sourceUrl: r.sourceUrl ?? '',
      ingredients: [...(r.ingredients ?? [])],
      preparationSteps: [...(r.preparationSteps ?? [])],
      utensils: r.utensils ?? '',
      tips: r.tips ?? '',
      substitutions: r.substitutions ?? '',
      storageInstructions: r.storageInstructions ?? '',
      estimatedCost: r.estimatedCost,
      personalRating: r.personalRating,
      tested: r.tested,
      notes: r.notes ?? '',
      active: r.active,
    };
    this.ingredientsText = (r.ingredients ?? []).join('\n');
    this.preparationText = (r.preparationSteps ?? []).join('\n');
    this.tagsText = (r.tags ?? []).join(', ');
    this.errorMessage = '';
    this.editModalVisible = true;
  }

  saveRecipe(): void {
    const r = this.recipe();
    if (!r || !this.editForm.name) {
      this.errorMessage = 'Nome é obrigatório.';
      return;
    }
    this.editForm.ingredients = this.ingredientsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    this.editForm.preparationSteps = this.preparationText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    this.editForm.tags = this.tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    this.saving.set(true);
    this.errorMessage = '';

    this.culinaryService.updateRecipe(r.id, this.editForm).subscribe({
      next: (updated) => {
        this.recipe.set(updated);
        this.saving.set(false);
        this.editModalVisible = false;
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage = err?.error?.error ?? 'Erro ao salvar receita.';
      },
    });
  }

  cancelEditModal(): void {
    this.editModalVisible = false;
    this.errorMessage = '';
  }

  getStatusLabel(value: string): string {
    const map: Record<string, string> = {
      tested: 'Testada',
      favorite: 'Favorita',
      needs_adjustment: 'Precisa de ajustes',
      pending: 'Pendente',
    };
    return map[value] ?? value;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      tested: 'status--tested',
      favorite: 'status--favorite',
      needs_adjustment: 'status--adjustment',
      pending: 'status--pending',
    };
    return map[status] ?? 'status--pending';
  }

  getYoutubeEmbedUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
}
