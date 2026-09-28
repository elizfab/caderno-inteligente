import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StudyNote } from '../../../shared/types/content-template.interface';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateNoteDto {
  date: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  type?: string;
  link?: string;
}

export interface UpdateNoteDto extends CreateNoteDto {}

@Injectable({ providedIn: 'root' })
export class ContentNoteService {
  constructor(private http: HttpClient) {}

  private base(itemId: string): string {
    return `${environment.apiUrl}/api/v1/study-items/${itemId}/notes`;
  }

  list(itemId: string): Observable<StudyNote[]> {
    return this.http
      .get<ApiResponse<StudyNote[]>>(this.base(itemId))
      .pipe(map((r) => r.data ?? []));
  }

  create(itemId: string, dto: CreateNoteDto): Observable<StudyNote> {
    return this.http
      .post<ApiResponse<StudyNote>>(this.base(itemId), dto)
      .pipe(map((r) => r.data));
  }

  update(itemId: string, noteId: string, dto: UpdateNoteDto): Observable<StudyNote> {
    return this.http
      .put<ApiResponse<StudyNote>>(`${this.base(itemId)}/${noteId}`, dto)
      .pipe(map((r) => r.data));
  }

  delete(itemId: string, noteId: string): Observable<void> {
    return this.http.delete<void>(`${this.base(itemId)}/${noteId}`);
  }
}
