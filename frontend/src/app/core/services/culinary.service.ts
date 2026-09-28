import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/environment';
import { CreateCulinaryCategoryDto, CreateCulinaryRecipeDto, CulinaryCategory, CulinaryRecipe, UpdateCulinaryCategoryDto, UpdateCulinaryRecipeDto } from '../../shared/types/culinaria.interface';
import { ApiResponse } from '../../shared/types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class CulinaryService {
  private readonly baseCategories = `${environment.apiUrl}/api/v1/culinary/categories`;
  private readonly baseRecipes = `${environment.apiUrl}/api/v1/culinary/recipes`;

  constructor(private http: HttpClient) {}

  private requireData<T>(res: ApiResponse<T>, errorMessage: string): T {
    if (res.data === undefined || res.data === null) {
      throw new Error(errorMessage);
    }
    return res.data;
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  listCategories(): Observable<CulinaryCategory[]> {
    return this.http
      .get<ApiResponse<CulinaryCategory[]>>(this.baseCategories)
      .pipe(map((res) => res.data ?? []));
  }

  getCategoryById(id: string): Observable<CulinaryCategory> {
    return this.http
      .get<ApiResponse<CulinaryCategory>>(`${this.baseCategories}/${id}`)
      .pipe(map((res) => this.requireData(res, 'Categoria não encontrada.')));
  }

  createCategory(dto: CreateCulinaryCategoryDto): Observable<CulinaryCategory> {
    return this.http
      .post<ApiResponse<CulinaryCategory>>(this.baseCategories, dto)
      .pipe(map((res) => this.requireData(res, 'Falha ao criar categoria.')));
  }

  updateCategory(id: string, dto: UpdateCulinaryCategoryDto): Observable<CulinaryCategory> {
    return this.http
      .put<ApiResponse<CulinaryCategory>>(`${this.baseCategories}/${id}`, dto)
      .pipe(map((res) => this.requireData(res, 'Falha ao atualizar categoria.')));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseCategories}/${id}`);
  }

  // ── Recipes ─────────────────────────────────────────────────────────────────

  listRecipes(categorySlug?: string): Observable<CulinaryRecipe[]> {
    const url = categorySlug
      ? `${this.baseRecipes}?category_slug=${encodeURIComponent(categorySlug)}`
      : this.baseRecipes;
    return this.http
      .get<ApiResponse<CulinaryRecipe[]>>(url)
      .pipe(map((res) => res.data ?? []));
  }

  getRecipeById(id: string): Observable<CulinaryRecipe> {
    return this.http
      .get<ApiResponse<CulinaryRecipe>>(`${this.baseRecipes}/${id}`)
      .pipe(map((res) => this.requireData(res, 'Receita não encontrada.')));
  }

  createRecipe(dto: CreateCulinaryRecipeDto): Observable<CulinaryRecipe> {
    return this.http
      .post<ApiResponse<CulinaryRecipe>>(this.baseRecipes, dto)
      .pipe(map((res) => this.requireData(res, 'Falha ao criar receita.')));
  }

  updateRecipe(id: string, dto: UpdateCulinaryRecipeDto): Observable<CulinaryRecipe> {
    return this.http
      .put<ApiResponse<CulinaryRecipe>>(`${this.baseRecipes}/${id}`, dto)
      .pipe(map((res) => this.requireData(res, 'Falha ao atualizar receita.')));
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseRecipes}/${id}`);
  }
}
