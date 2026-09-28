package mongodb

import (
	"context"
	"errors"
	"fmt"

	"tech-book-backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// baseRepository concentra as operações CRUD genéricas usadas por todos
// os repositórios MongoDB, evitando duplicação de código.
type baseRepository[T any] struct {
	col *mongo.Collection
}

func (r *baseRepository[T]) list(ctx context.Context, filter bson.M, sort bson.D) ([]T, error) {
	opts := options.Find()
	if sort != nil {
		opts.SetSort(sort)
	}
	cur, err := r.col.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("falha ao listar documentos: %w", err)
	}
	defer cur.Close(ctx)

	out := make([]T, 0)
	if err := cur.All(ctx, &out); err != nil {
		return nil, fmt.Errorf("falha ao decodificar documentos: %w", err)
	}
	return out, nil
}

func (r *baseRepository[T]) getByID(ctx context.Context, id string) (*T, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, repository.ErrInvalidID
	}
	var doc T
	if err := r.col.FindOne(ctx, bson.M{"_id": oid}).Decode(&doc); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, fmt.Errorf("falha ao buscar documento: %w", err)
	}
	return &doc, nil
}

func (r *baseRepository[T]) insert(ctx context.Context, doc any) (primitive.ObjectID, error) {
	res, err := r.col.InsertOne(ctx, doc)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return primitive.NilObjectID, repository.ErrDuplicate
		}
		return primitive.NilObjectID, fmt.Errorf("falha ao inserir documento: %w", err)
	}
	oid, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("id inserido não é um ObjectID válido")
	}
	return oid, nil
}

func (r *baseRepository[T]) updateByID(ctx context.Context, id string, fields bson.M) (*T, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, repository.ErrInvalidID
	}
	res, err := r.col.UpdateOne(ctx, bson.M{"_id": oid}, bson.M{"$set": fields})
	if err != nil {
		return nil, fmt.Errorf("falha ao atualizar documento: %w", err)
	}
	if res.MatchedCount == 0 {
		return nil, repository.ErrNotFound
	}
	return r.getByID(ctx, id)
}

func (r *baseRepository[T]) deleteByID(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return repository.ErrInvalidID
	}
	res, err := r.col.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return fmt.Errorf("falha ao remover documento: %w", err)
	}
	if res.DeletedCount == 0 {
		return repository.ErrNotFound
	}
	return nil
}
