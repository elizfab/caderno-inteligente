package handler

import (
	"net/http"

	"tech-book-backend/internal/domain/entity"
	"tech-book-backend/internal/usecase"
	"tech-book-backend/pkg/response"
)

type CulinaryHandler struct {
	uc *usecase.CulinaryUseCase
}

func NewCulinaryHandler(uc *usecase.CulinaryUseCase) *CulinaryHandler {
	return &CulinaryHandler{uc: uc}
}

func (h *CulinaryHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/culinary/categories", h.listCategories)
	mux.HandleFunc("POST /api/v1/culinary/categories", h.createCategory)
	mux.HandleFunc("GET /api/v1/culinary/categories/{id}", h.getCategory)
	mux.HandleFunc("PUT /api/v1/culinary/categories/{id}", h.updateCategory)
	mux.HandleFunc("DELETE /api/v1/culinary/categories/{id}", h.deleteCategory)

	mux.HandleFunc("GET /api/v1/culinary/recipes", h.listRecipes)
	mux.HandleFunc("POST /api/v1/culinary/recipes", h.createRecipe)
	mux.HandleFunc("GET /api/v1/culinary/recipes/{id}", h.getRecipe)
	mux.HandleFunc("PUT /api/v1/culinary/recipes/{id}", h.updateRecipe)
	mux.HandleFunc("DELETE /api/v1/culinary/recipes/{id}", h.deleteRecipe)
}

// ── Categories ───────────────────────────────────────────────────────────────

func (h *CulinaryHandler) listCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.uc.ListCategories(r.Context())
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, categories)
}

func (h *CulinaryHandler) getCategory(w http.ResponseWriter, r *http.Request) {
	category, err := h.uc.GetCategoryByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, category)
}

func (h *CulinaryHandler) createCategory(w http.ResponseWriter, r *http.Request) {
	var category entity.CulinaryCategory
	if !decodeJSON(w, r, &category) {
		return
	}
	created, err := h.uc.CreateCategory(r.Context(), &category)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *CulinaryHandler) updateCategory(w http.ResponseWriter, r *http.Request) {
	var category entity.CulinaryCategory
	if !decodeJSON(w, r, &category) {
		return
	}
	updated, err := h.uc.UpdateCategory(r.Context(), r.PathValue("id"), &category)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *CulinaryHandler) deleteCategory(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.DeleteCategory(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}

// ── Recipes ──────────────────────────────────────────────────────────────────

func (h *CulinaryHandler) listRecipes(w http.ResponseWriter, r *http.Request) {
	recipes, err := h.uc.ListRecipes(r.Context(), r.URL.Query().Get("category_slug"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, recipes)
}

func (h *CulinaryHandler) getRecipe(w http.ResponseWriter, r *http.Request) {
	recipe, err := h.uc.GetRecipeByID(r.Context(), r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, recipe)
}

func (h *CulinaryHandler) createRecipe(w http.ResponseWriter, r *http.Request) {
	var recipe entity.CulinaryRecipe
	if !decodeJSON(w, r, &recipe) {
		return
	}
	created, err := h.uc.CreateRecipe(r.Context(), &recipe)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusCreated, created)
}

func (h *CulinaryHandler) updateRecipe(w http.ResponseWriter, r *http.Request) {
	var recipe entity.CulinaryRecipe
	if !decodeJSON(w, r, &recipe) {
		return
	}
	updated, err := h.uc.UpdateRecipe(r.Context(), r.PathValue("id"), &recipe)
	if err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, updated)
}

func (h *CulinaryHandler) deleteRecipe(w http.ResponseWriter, r *http.Request) {
	if err := h.uc.DeleteRecipe(r.Context(), r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "removido com sucesso"})
}
