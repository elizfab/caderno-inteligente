package usecase

import (
	"context"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"
)

type QuizQuestionUseCase struct {
	repo repository.QuizQuestionRepository
}

func NewQuizQuestionUseCase(repo repository.QuizQuestionRepository) *QuizQuestionUseCase {
	return &QuizQuestionUseCase{repo: repo}
}

func (uc *QuizQuestionUseCase) List(ctx context.Context, section, topic string) ([]entity.QuizQuestion, error) {
	return uc.repo.List(ctx, section, topic)
}

func (uc *QuizQuestionUseCase) Create(ctx context.Context, question *entity.QuizQuestion) (*entity.QuizQuestion, error) {
	if question.Question == "" || question.Answer == "" {
		return nil, ErrValidation
	}
	if question.Tags == nil {
		question.Tags = []string{}
	}
	question.CreatedAt = time.Now()
	return uc.repo.Create(ctx, question)
}

func (uc *QuizQuestionUseCase) Delete(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}
