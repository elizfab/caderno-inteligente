package mongodb

import (
	"context"
	"fmt"

	"tech-book-backend/internal/domain/entity"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ── CourseSection ────────────────────────────────────────────────────────────

type CourseSectionRepository struct {
	baseRepository[entity.CourseSection]
}

func NewCourseSectionRepository(db *mongo.Database) *CourseSectionRepository {
	return &CourseSectionRepository{baseRepository[entity.CourseSection]{col: db.Collection("course_sections")}}
}

func (r *CourseSectionRepository) List(ctx context.Context) ([]entity.CourseSection, error) {
	return r.list(ctx, bson.M{}, bson.D{{Key: "order", Value: 1}, {Key: "name", Value: 1}})
}

func (r *CourseSectionRepository) GetByID(ctx context.Context, id string) (*entity.CourseSection, error) {
	return r.getByID(ctx, id)
}

func (r *CourseSectionRepository) Create(ctx context.Context, section *entity.CourseSection) (*entity.CourseSection, error) {
	oid, err := r.insert(ctx, section)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar área de estudo: %w", err)
	}
	section.ID = oid
	return section, nil
}

func (r *CourseSectionRepository) Update(ctx context.Context, id string, section *entity.CourseSection) (*entity.CourseSection, error) {
	fields, err := toUpdateFields(section)
	if err != nil {
		return nil, err
	}
	delete(fields, "slug") // slug é imutável após a criação
	return r.updateByID(ctx, id, fields)
}

func (r *CourseSectionRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}

// ── CourseTopic ──────────────────────────────────────────────────────────────

type CourseTopicRepository struct {
	baseRepository[entity.CourseTopic]
}

func NewCourseTopicRepository(db *mongo.Database) *CourseTopicRepository {
	return &CourseTopicRepository{baseRepository[entity.CourseTopic]{col: db.Collection("course_topics")}}
}

func (r *CourseTopicRepository) List(ctx context.Context, sectionSlug string) ([]entity.CourseTopic, error) {
	filter := bson.M{}
	if sectionSlug != "" {
		filter["sectionSlug"] = sectionSlug
	}
	return r.list(ctx, filter, bson.D{{Key: "order", Value: 1}, {Key: "label", Value: 1}})
}

func (r *CourseTopicRepository) GetByID(ctx context.Context, id string) (*entity.CourseTopic, error) {
	return r.getByID(ctx, id)
}

func (r *CourseTopicRepository) Create(ctx context.Context, topic *entity.CourseTopic) (*entity.CourseTopic, error) {
	oid, err := r.insert(ctx, topic)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar tópico: %w", err)
	}
	topic.ID = oid
	return topic, nil
}

func (r *CourseTopicRepository) Update(ctx context.Context, id string, topic *entity.CourseTopic) (*entity.CourseTopic, error) {
	fields, err := toUpdateFields(topic)
	if err != nil {
		return nil, err
	}
	delete(fields, "slug")
	delete(fields, "sectionSlug")
	return r.updateByID(ctx, id, fields)
}

func (r *CourseTopicRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}
