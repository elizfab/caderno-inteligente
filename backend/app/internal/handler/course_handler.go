package handler

import (
	"net/http"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

// ── CourseSection ────────────────────────────────────────────────────────────

type CourseSectionHandler struct {
	uc *usecase.CourseSectionUseCase
}

func NewCourseSectionHandler(uc *usecase.CourseSectionUseCase) *CourseSectionHandler {
	return &CourseSectionHandler{uc: uc}
}

func (h *CourseSectionHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/course-sections", h.list)
	mux.HandleFunc("POST /api/v1/course-sections", h.create)
	mux.HandleFunc("GET /api/v1/course-sections/{id}", h.getByID)
	mux.HandleFunc("PUT /api/v1/course-sections/{id}", h.update)
	mux.HandleFunc("DELETE /api/v1/course-sections/{id}", h.delete)
}

func (h *CourseSectionHandler) list(w http.ResponseWriter, r *http.Request) {
	sections, err := h.uc.List(r.Context())
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, sections)
}

func (h *CourseSectionHandler) getByID(w http.ResponseWriter, r *http.Request) {
	section, err := h.uc.GetByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, section)
}

func (h *CourseSectionHandler) create(w http.ResponseWriter, r *http.Request) {
	var section entity.CourseSection
	if !decodeJSON(w, r, &section) {
		return
	}
	created, err := h.uc.Create(r.Context(), &section)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *CourseSectionHandler) update(w http.ResponseWriter, r *http.Request) {
	var section entity.CourseSection
	if !decodeJSON(w, r, &section) {
		return
	}
	updated, err := h.uc.Update(r.Context(), r.PathValue("id"), &section)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *CourseSectionHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.Delete(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}

// ── CourseTopic ──────────────────────────────────────────────────────────────

type CourseTopicHandler struct {
	uc *usecase.CourseTopicUseCase
}

func NewCourseTopicHandler(uc *usecase.CourseTopicUseCase) *CourseTopicHandler {
	return &CourseTopicHandler{uc: uc}
}

func (h *CourseTopicHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/course-topics", h.list)
	mux.HandleFunc("POST /api/v1/course-topics", h.create)
	mux.HandleFunc("GET /api/v1/course-topics/{id}", h.getByID)
	mux.HandleFunc("PUT /api/v1/course-topics/{id}", h.update)
	mux.HandleFunc("DELETE /api/v1/course-topics/{id}", h.delete)
}

func (h *CourseTopicHandler) list(w http.ResponseWriter, r *http.Request) {
	topics, err := h.uc.List(r.Context(), r.URL.Query().Get("sectionSlug"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, topics)
}

func (h *CourseTopicHandler) getByID(w http.ResponseWriter, r *http.Request) {
	topic, err := h.uc.GetByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, topic)
}

func (h *CourseTopicHandler) create(w http.ResponseWriter, r *http.Request) {
	var topic entity.CourseTopic
	if !decodeJSON(w, r, &topic) {
		return
	}
	created, err := h.uc.Create(r.Context(), &topic)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *CourseTopicHandler) update(w http.ResponseWriter, r *http.Request) {
	var topic entity.CourseTopic
	if !decodeJSON(w, r, &topic) {
		return
	}
	updated, err := h.uc.Update(r.Context(), r.PathValue("id"), &topic)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *CourseTopicHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.Delete(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}
