import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CreateProjectDto, Project, ProjectType, UpdateProjectDto } from '../../../shared/types/project.interface';
import { ApiResponse } from '../../../shared/types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly base = `${environment.apiUrl}/api/v1/projects`;

  constructor(private http: HttpClient) {}

  list(type?: ProjectType): Observable<Project[]> {
    const params = type ? new HttpParams().set('type', type) : undefined;
    return this.http
      .get<ApiResponse<Project[]>>(this.base, { params })
      .pipe(map((res) => res.data ?? []));
  }

  getById(id: string): Observable<Project> {
    return this.http
      .get<ApiResponse<Project>>(`${this.base}/${id}`)
      .pipe(map((res) => res.data!));
  }

  create(dto: CreateProjectDto): Observable<Project> {
    return this.http
      .post<ApiResponse<Project>>(this.base, dto)
      .pipe(map((res) => res.data!));
  }

  update(id: string, dto: UpdateProjectDto): Observable<Project> {
    return this.http
      .put<ApiResponse<Project>>(`${this.base}/${id}`, dto)
      .pipe(map((res) => res.data!));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
