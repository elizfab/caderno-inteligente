import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DragDropModule } from 'primeng/dragdrop';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Icon } from '../../../shared/components/icon/icon';
import { HeaderActionsService } from '../../../core/services/header-actions/header-actions.service';
import {
  CreateCulinaryRecipeDto,
  CulinaryCategory,
  CulinaryRecipe,
  UpdateCulinaryRecipeDto,
} from '../../../shared/types/culinaria.interface';
import { CulinaryService } from '../../../core/services/culinary.service';

@Component({
  selector: 'app-culinary-category-page',
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
    SelectModule,
    TooltipModule,
    BackButtonComponent,
    Icon,
  ],
  templateUrl: './culinary-category-page.html',
  styleUrl: './culinary-category-page.scss',
})
export class CulinaryCategoryPage implements OnInit, OnDestroy {
  private readonly headerActions = inject(HeaderActionsService);

  categorySlug = '';
  category = signal<CulinaryCategory | null>(null);
  recipes = signal<CulinaryRecipe[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = '';

  modalVisible = false;
  editingRecipe: CulinaryRecipe | null = null;

  deleteModalVisible = false;
  deleteTargetId = '';
  deleteTargetName = '';

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

  form: CreateCulinaryRecipeDto = this.emptyForm();

  constructor(
    private route: ActivatedRoute,
    private culinaryService: CulinaryService,
  ) {}

  ngOnInit(): void {
    this.categorySlug = this.route.snapshot.paramMap.get('categorySlug') ?? '';
    this.loadData();

    this.headerActions.set([
      {
        id: 'nova-receita',
        label: 'Nova receita',
        icon: 'plus',
        variant: 'accent',
        tooltip: 'Cadastrar nova receita nesta categoria',
        run: () => this.openCreateModal(),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.headerActions.clear();
  }

  private emptyForm(): CreateCulinaryRecipeDto {
    return {
      categoryId: '',
      categorySlug: this.categorySlug,
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

  // Helper fields for textarea binding
  ingredientsText = '';
  preparationText = '';
  tagsText = '';

  private recipesToText(recipe: CulinaryRecipe): void {
    this.ingredientsText = (recipe.ingredients ?? []).join('\n');
    this.preparationText = (recipe.preparationSteps ?? []).join('\n');
    this.tagsText = (recipe.tags ?? []).join(', ');
  }

  private textToArrays(): void {
    this.form.ingredients = this.ingredientsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    this.form.preparationSteps = this.preparationText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    this.form.tags = this.tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  loadData(): void {
    this.loading.set(true);
    // Load category by slug via listing and finding
    this.culinaryService.listCategories().subscribe({
      next: (cats) => {
        const cat = cats.find((c) => c.slug === this.categorySlug) ?? null;
        this.category.set(cat);
        this.loadRecipes();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadRecipes(): void {
    this.culinaryService.listRecipes(this.categorySlug).subscribe({
      next: (recipes) => {
        this.recipes.set(recipes);
        this.loading.set(false);
      },
      error: () => {
        this.recipes.set([]);
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.editingRecipe = null;
    this.form = this.emptyForm();
    this.form.categorySlug = this.categorySlug;
    this.form.categoryId = this.category()?.id ?? '';
    this.ingredientsText = '';
    this.preparationText = '';
    this.tagsText = '';
    this.errorMessage = '';
    this.modalVisible = true;
  }

  openEditModal(recipe: CulinaryRecipe): void {
    this.editingRecipe = recipe;
    this.form = {
      categoryId: recipe.categoryId,
      categorySlug: recipe.categorySlug,
      name: recipe.name,
      slug: recipe.slug,
      description: recipe.description,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servingsStr: recipe.servingsStr,
      difficulty: recipe.difficulty,
      status: recipe.status,
      tags: [...(recipe.tags ?? [])],
      imageUrl: recipe.imageUrl ?? '',
      youtubeUrl: recipe.youtubeUrl ?? '',
      sourceUrl: recipe.sourceUrl ?? '',
      ingredients: [...(recipe.ingredients ?? [])],
      preparationSteps: [...(recipe.preparationSteps ?? [])],
      utensils: recipe.utensils ?? '',
      tips: recipe.tips ?? '',
      substitutions: recipe.substitutions ?? '',
      storageInstructions: recipe.storageInstructions ?? '',
      estimatedCost: recipe.estimatedCost,
      personalRating: recipe.personalRating,
      tested: recipe.tested,
      notes: recipe.notes ?? '',
      active: recipe.active,
    };
    this.recipesToText(recipe);
    this.errorMessage = '';
    this.modalVisible = true;
  }

  saveRecipe(): void {
    if (!this.form.name || !this.form.slug) {
      this.errorMessage = 'Nome e slug são obrigatórios.';
      return;
    }
    this.textToArrays();
    this.saving.set(true);
    this.errorMessage = '';

    const obs = this.editingRecipe
      ? this.culinaryService.updateRecipe(
          this.editingRecipe.id,
          this.form as UpdateCulinaryRecipeDto,
        )
      : this.culinaryService.createRecipe(this.form);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalVisible = false;
        this.loadRecipes();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage = err?.error?.error ?? 'Erro ao salvar receita.';
      },
    });
  }

  cancelModal(): void {
    this.modalVisible = false;
    this.errorMessage = '';
  }

  openDeleteModal(recipe: CulinaryRecipe): void {
    this.deleteTargetId = recipe.id;
    this.deleteTargetName = recipe.name;
    this.deleteModalVisible = true;
  }

  confirmDelete(): void {
    if (!this.deleteTargetId) {
      this.deleteModalVisible = false;
      return;
    }
    this.culinaryService.deleteRecipe(this.deleteTargetId).subscribe({
      next: () => {
        this.deleteModalVisible = false;
        this.loadRecipes();
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

  getDifficultyLabel(value: string): string {
    return this.difficultyOptions.find((o) => o.value === value)?.label ?? value;
  }

  getStatusLabel(value: string): string {
    return this.statusOptions.find((o) => o.value === value)?.label ?? value;
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
}
