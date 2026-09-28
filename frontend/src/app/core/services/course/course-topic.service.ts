import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CourseTopic, CreateCourseTopicDto, UpdateCourseTopicDto } from '../../../shared/types/course.interface';
import { ApiResponse } from '../../../shared/types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class CourseTopicService {
  private readonly base = `${environment.apiUrl}/api/v1/course-topics`;

  constructor(private http: HttpClient) {}

  list(sectionSlug?: string): Observable<CourseTopic[]> {
    const params = sectionSlug ? new HttpParams().set('sectionSlug', sectionSlug) : undefined;
    return this.http
      .get<ApiResponse<CourseTopic[]>>(this.base, { params })
      .pipe(map((res) => res.data ?? []));
  }

  getById(id: string): Observable<CourseTopic> {
    return this.http
      .get<ApiResponse<CourseTopic>>(`${this.base}/${id}`)
      .pipe(map((res) => res.data!));
  }

  create(dto: CreateCourseTopicDto): Observable<CourseTopic> {
    return this.http
      .post<ApiResponse<CourseTopic>>(this.base, dto)
      .pipe(map((res) => res.data!));
  }

  update(id: string, dto: UpdateCourseTopicDto): Observable<CourseTopic> {
    return this.http
      .put<ApiResponse<CourseTopic>>(`${this.base}/${id}`, dto)
      .pipe(map((res) => res.data!));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
