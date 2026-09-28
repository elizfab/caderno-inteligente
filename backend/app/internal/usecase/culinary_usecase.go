package usecase

import (
	"context"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"
)

type CulinaryUseCase struct {
	categories repository.CulinaryCategoryRepository
	recipes    repository.CulinaryRecipeRepository
}

func NewCulinaryUseCase(
	categories repository.CulinaryCategoryRepository,
	recipes repository.CulinaryRecipeRepository,
) *CulinaryUseCase {
	return &CulinaryUseCase{categories: categories, recipes: recipes}
}

// ── Categories ───────────────────────────────────────────────────────────────

func (uc *CulinaryUseCase) ListCategories(ctx context.Context) ([]entity.CulinaryCategory, error) {
	return uc.categories.List(ctx)
}

func (uc *CulinaryUseCase) GetCategoryByID(ctx context.Context, id string) (*entity.CulinaryCategory, error) {
	return uc.categories.GetByID(ctx, id)
}

func (uc *CulinaryUseCase) CreateCategory(ctx context.Context, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error) {
	if category.Name == "" || category.Slug == "" {
		return nil, ErrValidation
	}
	now := time.Now()
	category.CreatedAt = now
	category.UpdatedAt = now
	return uc.categories.Create(ctx, category)
}

func (uc *CulinaryUseCase) UpdateCategory(ctx context.Context, id string, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error) {
	if category.Name == "" {
		return nil, ErrValidation
	}
	category.UpdatedAt = time.Now()
	return uc.categories.Update(ctx, id, category)
}

func (uc *CulinaryUseCase) DeleteCategory(ctx context.Context, id string) error {
	return uc.categories.Delete(ctx, id)
}

// ── Recipes ──────────────────────────────────────────────────────────────────

func (uc *CulinaryUseCase) ListRecipes(ctx context.Context, categorySlug string) ([]entity.CulinaryRecipe, error) {
	return uc.recipes.List(ctx, categorySlug)
}

func (uc *CulinaryUseCase) GetRecipeByID(ctx context.Context, id string) (*entity.CulinaryRecipe, error) {
	return uc.recipes.GetByID(ctx, id)
}

func (uc *CulinaryUseCase) CreateRecipe(ctx context.Context, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error) {
	if recipe.Name == "" || recipe.Slug == "" || recipe.CategorySlug == "" {
		return nil, ErrValidation
	}
	if recipe.Tags == nil {
		recipe.Tags = []string{}
	}
	if recipe.Ingredients == nil {
		recipe.Ingredients = []string{}
	}
	if recipe.PreparationSteps == nil {
		recipe.PreparationSteps = []string{}
	}
	now := time.Now()
	recipe.CreatedAt = now
	recipe.UpdatedAt = now
	return uc.recipes.Create(ctx, recipe)
}

func (uc *CulinaryUseCase) UpdateRecipe(ctx context.Context, id string, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error) {
	if recipe.Name == "" {
		return nil, ErrValidation
	}
	recipe.UpdatedAt = time.Now()
	return uc.recipes.Update(ctx, id, recipe)
}

func (uc *CulinaryUseCase) DeleteRecipe(ctx context.Context, id string) error {
	return uc.recipes.Delete(ctx, id)
}
