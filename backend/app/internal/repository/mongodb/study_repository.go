package mongodb

import (
	"context"
	"fmt"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// ── StudyItem ────────────────────────────────────────────────────────────────

type StudyItemRepository struct {
	baseRepository[entity.StudyItem]
}

func NewStudyItemRepository(db *mongo.Database) *StudyItemRepository {
	return &StudyItemRepository{baseRepository[entity.StudyItem]{col: db.Collection("study_items")}}
}

func (r *StudyItemRepository) List(ctx context.Context, section, topic string) ([]entity.StudyItem, error) {
	filter := bson.M{}
	if section != "" {
		filter["section"] = section
	}
	if topic != "" {
		filter["topic"] = topic
	}
	return r.list(ctx, filter, bson.D{{Key: "createdAt", Value: -1}})
}

func (r *StudyItemRepository) GetByID(ctx context.Context, id string) (*entity.StudyItem, error) {
	return r.getByID(ctx, id)
}

func (r *StudyItemRepository) Create(ctx context.Context, item *entity.StudyItem) (*entity.StudyItem, error) {
	oid, err := r.insert(ctx, item)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar item de estudo: %w", err)
	}
	item.ID = oid
	return item, nil
}

func (r *StudyItemRepository) Update(ctx context.Context, id string, item *entity.StudyItem) (*entity.StudyItem, error) {
	fields, err := toUpdateFields(item)
	if err != nil {
		return nil, err
	}
	delete(fields, "section")
	delete(fields, "topic")
	return r.updateByID(ctx, id, fields)
}

func (r *StudyItemRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}

// ── Subrecursos (notes, resources, sessions) ────────────────────────────────

func itemFilter(itemID string) (bson.M, error) {
	oid, err := primitive.ObjectIDFromHex(itemID)
	if err != nil {
		return nil, repository.ErrInvalidID
	}
	return bson.M{"studyItemId": oid}, nil
}

type StudyNoteRepository struct {
	baseRepository[entity.StudyNote]
}

func NewStudyNoteRepository(db *mongo.Database) *StudyNoteRepository {
	return &StudyNoteRepository{baseRepository[entity.StudyNote]{col: db.Collection("study_notes")}}
}

func (r *StudyNoteRepository) ListByItem(ctx context.Context, itemID string) ([]entity.StudyNote, error) {
	filter, err := itemFilter(itemID)
	if err != nil {
		return nil, err
	}
	return r.list(ctx, filter, bson.D{{Key: "createdAt", Value: -1}})
}

func (r *StudyNoteRepository) Create(ctx context.Context, note *entity.StudyNote) (*entity.StudyNote, error) {
	oid, err := r.insert(ctx, note)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar anotação: %w", err)
	}
	note.ID = oid
	return note, nil
}

func (r *StudyNoteRepository) Update(ctx context.Context, id string, note *entity.StudyNote) (*entity.StudyNote, error) {
	fields, err := toUpdateFields(note)
	if err != nil {
		return nil, err
	}
	delete(fields, "studyItemId")
	return r.updateByID(ctx, id, fields)
}

func (r *StudyNoteRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}

type StudyResourceRepository struct {
	baseRepository[entity.StudyResource]
}

func NewStudyResourceRepository(db *mongo.Database) *StudyResourceRepository {
	return &StudyResourceRepository{baseRepository[entity.StudyResource]{col: db.Collection("study_resources")}}
}

func (r *StudyResourceRepository) ListByItem(ctx context.Context, itemID string) ([]entity.StudyResource, error) {
	filter, err := itemFilter(itemID)
	if err != nil {
		return nil, err
	}
	return r.list(ctx, filter, bson.D{{Key: "createdAt", Value: -1}})
}

func (r *StudyResourceRepository) Create(ctx context.Context, resource *entity.StudyResource) (*entity.StudyResource, error) {
	oid, err := r.insert(ctx, resource)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar recurso: %w", err)
	}
	resource.ID = oid
	return resource, nil
}

func (r *StudyResourceRepository) Update(ctx context.Context, id string, resource *entity.StudyResource) (*entity.StudyResource, error) {
	fields, err := toUpdateFields(resource)
	if err != nil {
		return nil, err
	}
	delete(fields, "studyItemId")
	return r.updateByID(ctx, id, fields)
}

func (r *StudyResourceRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}

type StudySessionRepository struct {
	baseRepository[entity.StudySession]
}

func NewStudySessionRepository(db *mongo.Database) *StudySessionRepository {
	return &StudySessionRepository{baseRepository[entity.StudySession]{col: db.Collection("study_sessions")}}
}

func (r *StudySessionRepository) ListByItem(ctx context.Context, itemID string) ([]entity.StudySession, error) {
	filter, err := itemFilter(itemID)
	if err != nil {
		return nil, err
	}
	return r.list(ctx, filter, bson.D{{Key: "createdAt", Value: -1}})
}

func (r *StudySessionRepository) Create(ctx context.Context, session *entity.StudySession) (*entity.StudySession, error) {
	oid, err := r.insert(ctx, session)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar sessão de estudo: %w", err)
	}
	session.ID = oid
	return session, nil
}
