package handler

import (
	"net/http"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

type QuizQuestionHandler struct {
	uc *usecase.QuizQuestionUseCase
}

func NewQuizQuestionHandler(uc *usecase.QuizQuestionUseCase) *QuizQuestionHandler {
	return &QuizQuestionHandler{uc: uc}
}

func (h *QuizQuestionHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/quiz-questions", h.list)
	mux.HandleFunc("POST /api/v1/quiz-questions", h.create)
	mux.HandleFunc("DELETE /api/v1/quiz-questions/{id}", h.delete)
}

func (h *QuizQuestionHandler) list(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	questions, err := h.uc.List(r.Context(), q.Get("section"), q.Get("topic"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, questions)
}

func (h *QuizQuestionHandler) create(w http.ResponseWriter, r *http.Request) {
	var question entity.QuizQuestion
	if !decodeJSON(w, r, &question) {
		return
	}
	created, err := h.uc.Create(r.Context(), &question)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *QuizQuestionHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.Delete(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}
