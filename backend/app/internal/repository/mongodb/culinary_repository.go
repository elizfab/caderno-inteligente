package mongodb

import (
	"context"
	"fmt"

	"tech-book-backend/internal/domain/entity"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ── CulinaryCategory ─────────────────────────────────────────────────────────

type CulinaryCategoryRepository struct {
	baseRepository[entity.CulinaryCategory]
}

func NewCulinaryCategoryRepository(db *mongo.Database) *CulinaryCategoryRepository {
	return &CulinaryCategoryRepository{baseRepository[entity.CulinaryCategory]{col: db.Collection("culinary_categories")}}
}

func (r *CulinaryCategoryRepository) List(ctx context.Context) ([]entity.CulinaryCategory, error) {
	return r.list(ctx, bson.M{}, bson.D{{Key: "order", Value: 1}, {Key: "name", Value: 1}})
}

func (r *CulinaryCategoryRepository) GetByID(ctx context.Context, id string) (*entity.CulinaryCategory, error) {
	return r.getByID(ctx, id)
}

func (r *CulinaryCategoryRepository) Create(ctx context.Context, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error) {
	oid, err := r.insert(ctx, category)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar categoria: %w", err)
	}
	category.ID = oid
	return category, nil
}

func (r *CulinaryCategoryRepository) Update(ctx context.Context, id string, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error) {
	fields, err := toUpdateFields(category)
	if err != nil {
		return nil, err
	}
	delete(fields, "slug")
	return r.updateByID(ctx, id, fields)
}

func (r *CulinaryCategoryRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}

// ── CulinaryRecipe ───────────────────────────────────────────────────────────

type CulinaryRecipeRepository struct {
	baseRepository[entity.CulinaryRecipe]
}

func NewCulinaryRecipeRepository(db *mongo.Database) *CulinaryRecipeRepository {
	return &CulinaryRecipeRepository{baseRepository[entity.CulinaryRecipe]{col: db.Collection("culinary_recipes")}}
}

func (r *CulinaryRecipeRepository) List(ctx context.Context, categorySlug string) ([]entity.CulinaryRecipe, error) {
	filter := bson.M{}
	if categorySlug != "" {
		filter["categorySlug"] = categorySlug
	}
	return r.list(ctx, filter, bson.D{{Key: "name", Value: 1}})
}

func (r *CulinaryRecipeRepository) GetByID(ctx context.Context, id string) (*entity.CulinaryRecipe, error) {
	return r.getByID(ctx, id)
}

func (r *CulinaryRecipeRepository) Create(ctx context.Context, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error) {
	oid, err := r.insert(ctx, recipe)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar receita: %w", err)
	}
	recipe.ID = oid
	return recipe, nil
}

func (r *CulinaryRecipeRepository) Update(ctx context.Context, id string, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error) {
	fields, err := toUpdateFields(recipe)
	if err != nil {
		return nil, err
	}
	return r.updateByID(ctx, id, fields)
}

func (r *CulinaryRecipeRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}
