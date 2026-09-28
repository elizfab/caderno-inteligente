package middleware

import (
	"context"
	"net/http"
	"strings"

	"tech-book-backend/pkg/response"
	"tech-book-backend/pkg/token"
)

type contextKey string

// ClaimsKey é a chave usada para armazenar as claims do usuário no contexto.
const ClaimsKey contextKey = "authClaims"

// Auth protege as rotas /api/v1 com JWT (Bearer token).
// Rotas públicas: /health e /api/v1/auth/*.
func Auth(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if isPublicRoute(r) {
				next.ServeHTTP(w, r)
				return
			}

			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				response.Error(w, http.StatusUnauthorized, "token de autenticação ausente")
				return
			}

			claims, err := token.Validate(secret, strings.TrimPrefix(authHeader, "Bearer "))
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "token inválido ou expirado")
				return
			}

			ctx := context.WithValue(r.Context(), ClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func isPublicRoute(r *http.Request) bool {
	if r.Method == http.MethodOptions {
		return true
	}
	path := r.URL.Path
	return path == "/health" || strings.HasPrefix(path, "/api/v1/auth/")
}

// ClaimsFromContext recupera as claims do usuário autenticado, se presentes.
func ClaimsFromContext(ctx context.Context) (*token.Claims, bool) {
	claims, ok := ctx.Value(ClaimsKey).(*token.Claims)
	return claims, ok
}
