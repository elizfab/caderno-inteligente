import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CourseSection, CreateCourseSectionDto, UpdateCourseSectionDto } from '../../../shared/types/course.interface';
import { ApiResponse } from '../../../shared/types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class CourseSectionService {
  private readonly base = `${environment.apiUrl}/api/v1/course-sections`;

  constructor(private http: HttpClient) {}

  list(): Observable<CourseSection[]> {
    return this.http
      .get<ApiResponse<CourseSection[]>>(this.base)
      .pipe(map((res) => res.data ?? []));
  }

  getById(id: string): Observable<CourseSection> {
    return this.http
      .get<ApiResponse<CourseSection>>(`${this.base}/${id}`)
      .pipe(map((res) => res.data ?? {} as CourseSection));
  }

  create(dto: CreateCourseSectionDto): Observable<CourseSection> {
    return this.http
      .post<ApiResponse<CourseSection>>(this.base, dto)
      .pipe(map((res) => res.data ?? {} as CourseSection));
  }

  update(id: string, dto: UpdateCourseSectionDto): Observable<CourseSection> {
    return this.http
      .put<ApiResponse<CourseSection>>(`${this.base}/${id}`, dto)
      .pipe(map((res) => res.data ?? {} as CourseSection));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
