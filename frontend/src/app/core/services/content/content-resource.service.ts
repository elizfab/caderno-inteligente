import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StudyResource } from '../../../shared/types/content-template.interface';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateResourceDto {
  title: string;
  url: string;
  type: string;
  description?: string;
  source?: string;
  priority?: string;
  resourceStatus?: string;
}

export interface UpdateResourceDto extends CreateResourceDto {}

@Injectable({ providedIn: 'root' })
export class ContentResourceService {
  constructor(private http: HttpClient) {}

  private base(itemId: string): string {
    return `${environment.apiUrl}/api/v1/study-items/${itemId}/resources`;
  }

  list(itemId: string): Observable<StudyResource[]> {
    return this.http
      .get<ApiResponse<StudyResource[]>>(this.base(itemId))
      .pipe(map((r) => r.data ?? []));
  }

  create(itemId: string, dto: CreateResourceDto): Observable<StudyResource> {
    return this.http
      .post<ApiResponse<StudyResource>>(this.base(itemId), dto)
      .pipe(map((r) => r.data));
  }

  update(itemId: string, resourceId: string, dto: UpdateResourceDto): Observable<StudyResource> {
    return this.http
      .put<ApiResponse<StudyResource>>(`${this.base(itemId)}/${resourceId}`, dto)
      .pipe(map((r) => r.data));
  }

  delete(itemId: string, resourceId: string): Observable<void> {
    return this.http.delete<void>(`${this.base(itemId)}/${resourceId}`);
  }
}
