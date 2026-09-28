package usecase

import (
	"context"
	"errors"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"
)

var ErrValidation = errors.New("dados inválidos")

// ── CourseSection ────────────────────────────────────────────────────────────

type CourseSectionUseCase struct {
	repo repository.CourseSectionRepository
}

func NewCourseSectionUseCase(repo repository.CourseSectionRepository) *CourseSectionUseCase {
	return &CourseSectionUseCase{repo: repo}
}

func (uc *CourseSectionUseCase) List(ctx context.Context) ([]entity.CourseSection, error) {
	return uc.repo.List(ctx)
}

func (uc *CourseSectionUseCase) GetByID(ctx context.Context, id string) (*entity.CourseSection, error) {
	return uc.repo.GetByID(ctx, id)
}

func (uc *CourseSectionUseCase) Create(ctx context.Context, section *entity.CourseSection) (*entity.CourseSection, error) {
	if section.Name == "" || section.Slug == "" {
		return nil, ErrValidation
	}
	now := time.Now()
	section.CreatedAt = now
	section.UpdatedAt = now
	return uc.repo.Create(ctx, section)
}

func (uc *CourseSectionUseCase) Update(ctx context.Context, id string, section *entity.CourseSection) (*entity.CourseSection, error) {
	if section.Name == "" {
		return nil, ErrValidation
	}
	section.UpdatedAt = time.Now()
	return uc.repo.Update(ctx, id, section)
}

func (uc *CourseSectionUseCase) Delete(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}

// ── CourseTopic ──────────────────────────────────────────────────────────────

type CourseTopicUseCase struct {
	repo repository.CourseTopicRepository
}

func NewCourseTopicUseCase(repo repository.CourseTopicRepository) *CourseTopicUseCase {
	return &CourseTopicUseCase{repo: repo}
}

func (uc *CourseTopicUseCase) List(ctx context.Context, sectionSlug string) ([]entity.CourseTopic, error) {
	return uc.repo.List(ctx, sectionSlug)
}

func (uc *CourseTopicUseCase) GetByID(ctx context.Context, id string) (*entity.CourseTopic, error) {
	return uc.repo.GetByID(ctx, id)
}

func (uc *CourseTopicUseCase) Create(ctx context.Context, topic *entity.CourseTopic) (*entity.CourseTopic, error) {
	if topic.Label == "" || topic.Slug == "" || topic.SectionSlug == "" {
		return nil, ErrValidation
	}
	now := time.Now()
	topic.CreatedAt = now
	topic.UpdatedAt = now
	return uc.repo.Create(ctx, topic)
}

func (uc *CourseTopicUseCase) Update(ctx context.Context, id string, topic *entity.CourseTopic) (*entity.CourseTopic, error) {
	if topic.Label == "" {
		return nil, ErrValidation
	}
	topic.UpdatedAt = time.Now()
	return uc.repo.Update(ctx, id, topic)
}

func (uc *CourseTopicUseCase) Delete(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}
