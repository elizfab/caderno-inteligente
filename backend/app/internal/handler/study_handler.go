package handler

import (
	"net/http"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

type StudyItemHandler struct {
	items *usecase.StudyItemUseCase
	subs  *usecase.StudySubResourcesUseCase
}

func NewStudyItemHandler(items *usecase.StudyItemUseCase, subs *usecase.StudySubResourcesUseCase) *StudyItemHandler {
	return &StudyItemHandler{items: items, subs: subs}
}

func (h *StudyItemHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/study-items", h.list)
	mux.HandleFunc("POST /api/v1/study-items", h.create)
	mux.HandleFunc("GET /api/v1/study-items/{id}", h.getByID)
	mux.HandleFunc("PUT /api/v1/study-items/{id}", h.update)
	mux.HandleFunc("DELETE /api/v1/study-items/{id}", h.delete)

	mux.HandleFunc("GET /api/v1/study-items/{id}/notes", h.listNotes)
	mux.HandleFunc("POST /api/v1/study-items/{id}/notes", h.createNote)
	mux.HandleFunc("PUT /api/v1/study-items/{id}/notes/{noteId}", h.updateNote)
	mux.HandleFunc("DELETE /api/v1/study-items/{id}/notes/{noteId}", h.deleteNote)

	mux.HandleFunc("GET /api/v1/study-items/{id}/resources", h.listResources)
	mux.HandleFunc("POST /api/v1/study-items/{id}/resources", h.createResource)
	mux.HandleFunc("PUT /api/v1/study-items/{id}/resources/{resourceId}", h.updateResource)
	mux.HandleFunc("DELETE /api/v1/study-items/{id}/resources/{resourceId}", h.deleteResource)

	mux.HandleFunc("GET /api/v1/study-items/{id}/sessions", h.listSessions)
	mux.HandleFunc("POST /api/v1/study-items/{id}/sessions", h.createSession)
}

// ── Items ────────────────────────────────────────────────────────────────────

func (h *StudyItemHandler) list(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	items, err := h.items.List(r.Context(), q.Get("section"), q.Get("topic"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, items)
}

func (h *StudyItemHandler) getByID(w http.ResponseWriter, r *http.Request) {
	item, err := h.items.GetByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, item)
}

func (h *StudyItemHandler) create(w http.ResponseWriter, r *http.Request) {
	var item entity.StudyItem
	if !decodeJSON(w, r, &item) {
		return
	}
	created, err := h.items.Create(r.Context(), &item)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *StudyItemHandler) update(w http.ResponseWriter, r *http.Request) {
	var item entity.StudyItem
	if !decodeJSON(w, r, &item) {
		return
	}
	updated, err := h.items.Update(r.Context(), r.PathValue("id"), &item)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *StudyItemHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.items.Delete(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}

// ── Notes ────────────────────────────────────────────────────────────────────

func (h *StudyItemHandler) listNotes(w http.ResponseWriter, r *http.Request) {
	notes, err := h.subs.ListNotes(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, notes)
}

func (h *StudyItemHandler) createNote(w http.ResponseWriter, r *http.Request) {
	var note entity.StudyNote
	if !decodeJSON(w, r, &note) {
		return
	}
	created, err := h.subs.CreateNote(r.Context(), r.PathValue("id"), &note)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *StudyItemHandler) updateNote(w http.ResponseWriter, r *http.Request) {
	var note entity.StudyNote
	if !decodeJSON(w, r, &note) {
		return
	}
	updated, err := h.subs.UpdateNote(r.Context(), r.PathValue("noteId"), &note)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *StudyItemHandler) deleteNote(w http.ResponseWriter, r *http.Request) {
	if err := h.subs.DeleteNote(r.Context(), r.PathValue("noteId")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}

// ── Resources ────────────────────────────────────────────────────────────────

func (h *StudyItemHandler) listResources(w http.ResponseWriter, r *http.Request) {
	resources, err := h.subs.ListResources(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, resources)
}

func (h *StudyItemHandler) createResource(w http.ResponseWriter, r *http.Request) {
	var resource entity.StudyResource
	if !decodeJSON(w, r, &resource) {
		return
	}
	created, err := h.subs.CreateResource(r.Context(), r.PathValue("id"), &resource)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *StudyItemHandler) updateResource(w http.ResponseWriter, r *http.Request) {
	var resource entity.StudyResource
	if !decodeJSON(w, r, &resource) {
		return
	}
	updated, err := h.subs.UpdateResource(r.Context(), r.PathValue("resourceId"), &resource)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *StudyItemHandler) deleteResource(w http.ResponseWriter, r *http.Request) {
	if err := h.subs.DeleteResource(r.Context(), r.PathValue("resourceId")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}

// ── Sessions ─────────────────────────────────────────────────────────────────

func (h *StudyItemHandler) listSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.subs.ListSessions(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, sessions)
}

func (h *StudyItemHandler) createSession(w http.ResponseWriter, r *http.Request) {
	var session entity.StudySession
	if !decodeJSON(w, r, &session) {
		return
	}
	created, err := h.subs.CreateSession(r.Context(), r.PathValue("id"), &session)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}
