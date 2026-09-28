package mongodb

import (
	"context"
	"errors"
	"fmt"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	baseRepository[entity.User]
}

func NewUserRepository(db *mongo.Database) *UserRepository {
	return &UserRepository{baseRepository[entity.User]{col: db.Collection("users")}}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	if err := r.col.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, fmt.Errorf("falha ao buscar usuário: %w", err)
	}
	return &user, nil
}

func (r *UserRepository) Create(ctx context.Context, user *entity.User) (*entity.User, error) {
	oid, err := r.insert(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar usuário: %w", err)
	}
	user.ID = oid
	return user, nil
}

func (r *UserRepository) Count(ctx context.Context) (int64, error) {
	count, err := r.col.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, fmt.Errorf("falha ao contar usuários: %w", err)
	}
	return count, nil
}
