package repository

import (
	"context"
	"errors"

	"tech-book-backend/internal/domain/entity"
)

// Erros de domínio compartilhados entre repositórios.
var (
	ErrNotFound  = errors.New("registro não encontrado")
	ErrInvalidID = errors.New("id inválido")
	ErrDuplicate = errors.New("registro duplicado")
)

// UserRepository define o contrato de persistência de usuários.
type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	Create(ctx context.Context, user *entity.User) (*entity.User, error)
	Count(ctx context.Context) (int64, error)
}

// CourseSectionRepository define o contrato de persistência de áreas de estudo.
type CourseSectionRepository interface {
	List(ctx context.Context) ([]entity.CourseSection, error)
	GetByID(ctx context.Context, id string) (*entity.CourseSection, error)
	Create(ctx context.Context, section *entity.CourseSection) (*entity.CourseSection, error)
	Update(ctx context.Context, id string, section *entity.CourseSection) (*entity.CourseSection, error)
	Delete(ctx context.Context, id string) error
}

// CourseTopicRepository define o contrato de persistência de tópicos.
type CourseTopicRepository interface {
	List(ctx context.Context, sectionSlug string) ([]entity.CourseTopic, error)
	GetByID(ctx context.Context, id string) (*entity.CourseTopic, error)
	Create(ctx context.Context, topic *entity.CourseTopic) (*entity.CourseTopic, error)
	Update(ctx context.Context, id string, topic *entity.CourseTopic) (*entity.CourseTopic, error)
	Delete(ctx context.Context, id string) error
}

// StudyItemRepository define o contrato de persistência de itens de estudo.
type StudyItemRepository interface {
	List(ctx context.Context, section, topic string) ([]entity.StudyItem, error)
	GetByID(ctx context.Context, id string) (*entity.StudyItem, error)
	Create(ctx context.Context, item *entity.StudyItem) (*entity.StudyItem, error)
	Update(ctx context.Context, id string, item *entity.StudyItem) (*entity.StudyItem, error)
	Delete(ctx context.Context, id string) error
}

// StudyNoteRepository define o contrato de persistência de anotações.
type StudyNoteRepository interface {
	ListByItem(ctx context.Context, itemID string) ([]entity.StudyNote, error)
	Create(ctx context.Context, note *entity.StudyNote) (*entity.StudyNote, error)
	Update(ctx context.Context, id string, note *entity.StudyNote) (*entity.StudyNote, error)
	Delete(ctx context.Context, id string) error
}

// StudyResourceRepository define o contrato de persistência de recursos.
type StudyResourceRepository interface {
	ListByItem(ctx context.Context, itemID string) ([]entity.StudyResource, error)
	Create(ctx context.Context, resource *entity.StudyResource) (*entity.StudyResource, error)
	Update(ctx context.Context, id string, resource *entity.StudyResource) (*entity.StudyResource, error)
	Delete(ctx context.Context, id string) error
}

// StudySessionRepository define o contrato de persistência de sessões de estudo.
type StudySessionRepository interface {
	ListByItem(ctx context.Context, itemID string) ([]entity.StudySession, error)
	Create(ctx context.Context, session *entity.StudySession) (*entity.StudySession, error)
}

// ProjectRepository define o contrato de persistência de projetos.
type ProjectRepository interface {
	List(ctx context.Context, projectType string) ([]entity.Project, error)
	GetByID(ctx context.Context, id string) (*entity.Project, error)
	Create(ctx context.Context, project *entity.Project) (*entity.Project, error)
	Update(ctx context.Context, id string, project *entity.Project) (*entity.Project, error)
	Delete(ctx context.Context, id string) error
}

// CulinaryCategoryRepository define o contrato de persistência de categorias culinárias.
type CulinaryCategoryRepository interface {
	List(ctx context.Context) ([]entity.CulinaryCategory, error)
	GetByID(ctx context.Context, id string) (*entity.CulinaryCategory, error)
	Create(ctx context.Context, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error)
	Update(ctx context.Context, id string, category *entity.CulinaryCategory) (*entity.CulinaryCategory, error)
	Delete(ctx context.Context, id string) error
}

// CulinaryRecipeRepository define o contrato de persistência de receitas.
type CulinaryRecipeRepository interface {
	List(ctx context.Context, categorySlug string) ([]entity.CulinaryRecipe, error)
	GetByID(ctx context.Context, id string) (*entity.CulinaryRecipe, error)
	Create(ctx context.Context, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error)
	Update(ctx context.Context, id string, recipe *entity.CulinaryRecipe) (*entity.CulinaryRecipe, error)
	Delete(ctx context.Context, id string) error
}

// QuizQuestionRepository define o contrato de persistência de perguntas de quiz.
type QuizQuestionRepository interface {
	List(ctx context.Context, section, topic string) ([]entity.QuizQuestion, error)
	Create(ctx context.Context, question *entity.QuizQuestion) (*entity.QuizQuestion, error)
	Delete(ctx context.Context, id string) error
}
