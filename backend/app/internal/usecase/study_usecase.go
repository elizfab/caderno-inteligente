package usecase

import (
	"context"
	"fmt"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ── StudyItem ────────────────────────────────────────────────────────────────

type StudyItemUseCase struct {
	repo repository.StudyItemRepository
}

func NewStudyItemUseCase(repo repository.StudyItemRepository) *StudyItemUseCase {
	return &StudyItemUseCase{repo: repo}
}

func withDetailRoute(item *entity.StudyItem) *entity.StudyItem {
	item.DetailRoute = fmt.Sprintf("/%s/%s/%s", item.Section, item.Topic, item.ID.Hex())
	return item
}

func (uc *StudyItemUseCase) List(ctx context.Context, section, topic string) ([]entity.StudyItem, error) {
	items, err := uc.repo.List(ctx, section, topic)
	if err != nil {
		return nil, err
	}
	for i := range items {
		withDetailRoute(&items[i])
	}
	return items, nil
}

func (uc *StudyItemUseCase) GetByID(ctx context.Context, id string) (*entity.StudyItem, error) {
	item, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return withDetailRoute(item), nil
}

func (uc *StudyItemUseCase) Create(ctx context.Context, item *entity.StudyItem) (*entity.StudyItem, error) {
	if item.Section == "" || item.Topic == "" || item.CourseName == "" {
		return nil, ErrValidation
	}
	if item.Status == "" {
		item.Status = "Não iniciado"
	}
	now := time.Now()
	item.CreatedAt = now
	item.UpdatedAt = now
	created, err := uc.repo.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return withDetailRoute(created), nil
}

func (uc *StudyItemUseCase) Update(ctx context.Context, id string, item *entity.StudyItem) (*entity.StudyItem, error) {
	if item.CourseName == "" {
		return nil, ErrValidation
	}
	item.UpdatedAt = time.Now()
	updated, err := uc.repo.Update(ctx, id, item)
	if err != nil {
		return nil, err
	}
	return withDetailRoute(updated), nil
}

func (uc *StudyItemUseCase) Delete(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}

// ── Subrecursos ──────────────────────────────────────────────────────────────

type StudySubResourcesUseCase struct {
	notes     repository.StudyNoteRepository
	resources repository.StudyResourceRepository
	sessions  repository.StudySessionRepository
}

func NewStudySubResourcesUseCase(
	notes repository.StudyNoteRepository,
	resources repository.StudyResourceRepository,
	sessions repository.StudySessionRepository,
) *StudySubResourcesUseCase {
	return &StudySubResourcesUseCase{notes: notes, resources: resources, sessions: sessions}
}

func parseItemID(itemID string) (primitive.ObjectID, error) {
	oid, err := primitive.ObjectIDFromHex(itemID)
	if err != nil {
		return primitive.NilObjectID, repository.ErrInvalidID
	}
	return oid, nil
}

func (uc *StudySubResourcesUseCase) ListNotes(ctx context.Context, itemID string) ([]entity.StudyNote, error) {
	return uc.notes.ListByItem(ctx, itemID)
}

func (uc *StudySubResourcesUseCase) CreateNote(ctx context.Context, itemID string, note *entity.StudyNote) (*entity.StudyNote, error) {
	oid, err := parseItemID(itemID)
	if err != nil {
		return nil, err
	}
	if note.Title == "" {
		return nil, ErrValidation
	}
	note.StudyItemID = oid
	now := time.Now()
	note.CreatedAt = now
	note.UpdatedAt = now
	return uc.notes.Create(ctx, note)
}

func (uc *StudySubResourcesUseCase) UpdateNote(ctx context.Context, noteID string, note *entity.StudyNote) (*entity.StudyNote, error) {
	if note.Title == "" {
		return nil, ErrValidation
	}
	note.UpdatedAt = time.Now()
	return uc.notes.Update(ctx, noteID, note)
}

func (uc *StudySubResourcesUseCase) DeleteNote(ctx context.Context, noteID string) error {
	return uc.notes.Delete(ctx, noteID)
}

func (uc *StudySubResourcesUseCase) ListResources(ctx context.Context, itemID string) ([]entity.StudyResource, error) {
	return uc.resources.ListByItem(ctx, itemID)
}

func (uc *StudySubResourcesUseCase) CreateResource(ctx context.Context, itemID string, resource *entity.StudyResource) (*entity.StudyResource, error) {
	oid, err := parseItemID(itemID)
	if err != nil {
		return nil, err
	}
	if resource.Title == "" || resource.URL == "" {
		return nil, ErrValidation
	}
	resource.StudyItemID = oid
	now := time.Now()
	resource.CreatedAt = now
	resource.UpdatedAt = now
	return uc.resources.Create(ctx, resource)
}

func (uc *StudySubResourcesUseCase) UpdateResource(ctx context.Context, resourceID string, resource *entity.StudyResource) (*entity.StudyResource, error) {
	if resource.Title == "" || resource.URL == "" {
		return nil, ErrValidation
	}
	resource.UpdatedAt = time.Now()
	return uc.resources.Update(ctx, resourceID, resource)
}

func (uc *StudySubResourcesUseCase) DeleteResource(ctx context.Context, resourceID string) error {
	return uc.resources.Delete(ctx, resourceID)
}

func (uc *StudySubResourcesUseCase) ListSessions(ctx context.Context, itemID string) ([]entity.StudySession, error) {
	return uc.sessions.ListByItem(ctx, itemID)
}

func (uc *StudySubResourcesUseCase) CreateSession(ctx context.Context, itemID string, session *entity.StudySession) (*entity.StudySession, error) {
	oid, err := parseItemID(itemID)
	if err != nil {
		return nil, err
	}
	session.StudyItemID = oid
	session.CreatedAt = time.Now()
	return uc.sessions.Create(ctx, session)
}
