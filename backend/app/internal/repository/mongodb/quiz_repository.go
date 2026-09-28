package mongodb

import (
	"context"
	"fmt"

	"tech-book-backend/internal/domain/entity"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuizQuestionRepository struct {
	baseRepository[entity.QuizQuestion]
}

func NewQuizQuestionRepository(db *mongo.Database) *QuizQuestionRepository {
	return &QuizQuestionRepository{baseRepository[entity.QuizQuestion]{col: db.Collection("quiz_questions")}}
}

func (r *QuizQuestionRepository) List(ctx context.Context, section, topic string) ([]entity.QuizQuestion, error) {
	filter := bson.M{}
	if section != "" {
		filter["section"] = section
	}
	if topic != "" {
		filter["topic"] = topic
	}
	return r.list(ctx, filter, bson.D{{Key: "createdAt", Value: -1}})
}

func (r *QuizQuestionRepository) Create(ctx context.Context, question *entity.QuizQuestion) (*entity.QuizQuestion, error) {
	oid, err := r.insert(ctx, question)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar pergunta: %w", err)
	}
	question.ID = oid
	return question, nil
}

func (r *QuizQuestionRepository) Delete(ctx context.Context, id string) error {
	return r.deleteByID(ctx, id)
}
