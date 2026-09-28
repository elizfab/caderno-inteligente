package mongodb

import (
	"context"
	"fmt"

	"tech-book-backend/internal/domain/entity"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProjectRepository struct {
	baseRepository[entity.Project]
}

func NewProjectRepository(db *mongo.Database) *ProjectRepository {
	return &ProjectRepository{baseRepository[entity.Project]{col: db.Collection("projects")}}
}

func (r *ProjectRepository) List(ctx context.Context, projectType string) ([]entity.Project, error) {
	filter := bson.M{}
	if projectType != "" {
		filter["type"] = projectType
	}
	return r.list(ctx, filter, bson.D{{Key: "order", Value: 1}, {Key: "name", Value: 1}})
}

func (r *ProjectRepository) GetByID(ctx context.Context, id string) (*entity.Project, error) {
	return r.getByID(ctx, id)
}

func (r *ProjectRepository) Create(ctx context.Context, project *entity.Project) (*entity.Project, error) {
	oid, err := r.insert(ctx, project)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar projeto: %w", err)
	}
	project.ID = oid
	return project, nil
}

func (r *ProjectRepository) Update(ctx context.Context, id string, project *entity.Project) (*entity.Project, error) {
	fields, err := toUpdateFields(project)
	if err != nil {
		return nil, err
	}
	return r.updateByID(ctx, id, fields)
}

func (r *ProjectRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}
