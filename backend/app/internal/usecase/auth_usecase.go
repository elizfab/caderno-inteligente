package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/domain/repository"
	"tech-book-backend/pkg/token"

	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("e-mail ou senha inválidos")

// AuthUseCase concentra as regras de autenticação.
type AuthUseCase struct {
	users     repository.UserRepository
	jwtSecret string
	tokenTTL  time.Duration
}

func NewAuthUseCase(users repository.UserRepository, jwtSecret string) *AuthUseCase {
	return &AuthUseCase{users: users, jwtSecret: jwtSecret, tokenTTL: 24 * time.Hour}
}

// LoginResult é o retorno do caso de uso de login.
type LoginResult struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expiresAt"`
	User      *entity.User `json:"user"`
}

// Login valida as credenciais e emite um JWT.
func (uc *AuthUseCase) Login(ctx context.Context, email, password string) (*LoginResult, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" || password == "" {
		return nil, ErrInvalidCredentials
	}

	user, err := uc.users.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, fmt.Errorf("falha ao autenticar: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	tok, err := token.Generate(uc.jwtSecret, user.ID.Hex(), user.Email, user.Name, uc.tokenTTL)
	if err != nil {
		return nil, fmt.Errorf("falha ao gerar token: %w", err)
	}

	return &LoginResult{
		Token:     tok,
		ExpiresAt: time.Now().Add(uc.tokenTTL),
		User:      user,
	}, nil
}

// SeedDefaultUser cria o usuário administrador inicial quando a base está vazia.
func (uc *AuthUseCase) SeedDefaultUser(ctx context.Context, name, email, password string) error {
	count, err := uc.users.Count(ctx)
	if err != nil {
		return fmt.Errorf("falha ao verificar usuários existentes: %w", err)
	}
	if count > 0 {
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("falha ao gerar hash de senha: %w", err)
	}

	now := time.Now()
	_, err = uc.users.Create(ctx, &entity.User{
		Name:         name,
		Email:        strings.ToLower(strings.TrimSpace(email)),
		PasswordHash: string(hash),
		CreatedAt:    now,
		UpdatedAt:    now,
	})
	if err != nil {
		return fmt.Errorf("falha ao criar usuário padrão: %w", err)
	}
	return nil
}
