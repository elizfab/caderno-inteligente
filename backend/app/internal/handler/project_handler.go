package handler

import (
	"net/http"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

type ProjectHandler struct {
	uc *usecase.ProjectUseCase
}

func NewProjectHandler(uc *usecase.ProjectUseCase) *ProjectHandler {
	return &ProjectHandler{uc: uc}
}

func (h *ProjectHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/projects", h.list)
	mux.HandleFunc("POST /api/v1/projects", h.create)
	mux.HandleFunc("GET /api/v1/projects/{id}", h.getByID)
	mux.HandleFunc("PUT /api/v1/projects/{id}", h.update)
	mux.HandleFunc("DELETE /api/v1/projects/{id}", h.delete)
}

func (h *ProjectHandler) list(w http.ResponseWriter, r *http.Request) {
	projects, err := h.uc.List(r.Context(), r.URL.Query().Get("type"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, projects)
}

func (h *ProjectHandler) getByID(w http.ResponseWriter, r *http.Request) {
	project, err := h.uc.GetByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, project)
}

func (h *ProjectHandler) create(w http.ResponseWriter, r *http.Request) {
	var project entity.Project
	if !decodeJSON(w, r, &project) {
		return
	}
	created, err := h.uc.Create(r.Context(), &project)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *ProjectHandler) update(w http.ResponseWriter, r *http.Request) {
	var project entity.Project
	if !decodeJSON(w, r, &project) {
		return
	}
	updated, err := h.uc.Update(r.Context(), r.PathValue("id"), &project)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *ProjectHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.Delete(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}
