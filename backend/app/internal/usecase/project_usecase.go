package usecase

import (
	"context"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"
)

type ProjectUseCase struct {
	repo repository.ProjectRepository
}

func NewProjectUseCase(repo repository.ProjectRepository) *ProjectUseCase {
	return &ProjectUseCase{repo: repo}
}

func validProjectType(t string) bool {
	return t == "pessoal" || t == "profissional"
}

func (uc *ProjectUseCase) List(ctx context.Context, projectType string) ([]entity.Project, error) {
	return uc.repo.List(ctx, projectType)
}

func (uc *ProjectUseCase) GetByID(ctx context.Context, id string) (*entity.Project, error) {
	return uc.repo.GetByID(ctx, id)
}

func (uc *ProjectUseCase) Create(ctx context.Context, project *entity.Project) (*entity.Project, error) {
	if project.Name == "" || !validProjectType(project.Type) {
		return nil, ErrValidation
	}
	if project.Tags == nil {
		project.Tags = []string{}
	}
	now := time.Now()
	project.CreatedAt = now
	project.UpdatedAt = now
	return uc.repo.Create(ctx, project)
}

func (uc *ProjectUseCase) Update(ctx context.Context, id string, project *entity.Project) (*entity.Project, error) {
	if project.Name == "" || !validProjectType(project.Type) {
		return nil, ErrValidation
	}
	if project.Tags == nil {
		project.Tags = []string{}
	}
	project.UpdatedAt = time.Now()
	return uc.repo.Update(ctx, id, project)
}

func (uc *ProjectUseCase) Delete(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}
