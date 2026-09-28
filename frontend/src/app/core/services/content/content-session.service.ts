import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StudySession } from '../../../shared/types/content-template.interface';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateSessionDto {
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  topic: string;
  notes?: string;
  rating: number;
  milestonesCompleted: number;
  focus?: string;
}

@Injectable({ providedIn: 'root' })
export class ContentSessionService {
  constructor(private http: HttpClient) {}

  private base(itemId: string): string {
    return `${environment.apiUrl}/api/v1/study-items/${itemId}/sessions`;
  }

  list(itemId: string): Observable<StudySession[]> {
    return this.http
      .get<ApiResponse<StudySession[]>>(this.base(itemId))
      .pipe(map((r) => r.data ?? []));
  }

  create(itemId: string, dto: CreateSessionDto): Observable<StudySession> {
    return this.http
      .post<ApiResponse<StudySession>>(this.base(itemId), dto)
      .pipe(map((r) => r.data));
  }
}
