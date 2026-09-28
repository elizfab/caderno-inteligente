package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"tech-book-backend/internal/domain/repository"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

// decodeJSON lê o corpo da requisição para dst. Em caso de erro já responde 400.
func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return false
	}
	return true
}

// writeError converte erros de domínio no status HTTP adequado.
func writeError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, usecase.ErrValidation):
		response.Error(w, http.StatusBadRequest, "dados obrigatórios ausentes ou inválidos")
	case errors.Is(err, repository.ErrInvalidID):
		response.Error(w, http.StatusBadRequest, "id inválido")
	case errors.Is(err, repository.ErrNotFound):
		response.Error(w, http.StatusNotFound, "registro não encontrado")
	case errors.Is(err, repository.ErrDuplicate):
		response.Error(w, http.StatusConflict, "já existe um registro com esses dados")
	case errors.Is(err, usecase.ErrInvalidCredentials):
		response.Error(w, http.StatusUnauthorized, "e-mail ou senha inválidos")
	default:
		response.Error(w, http.StatusInternalServerError, "erro interno do servidor")
	}
}
