import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  CourseSectionService,

} from './course-section.service';
import { environment } from '../../../environment/environment';
import { CourseSection, CreateCourseSectionDto, UpdateCourseSectionDto } from '../../../shared/types/course.interface';

const BASE = `${environment.apiUrl}/api/v1/course-sections`;
const mockSection: CourseSection = {
  id: 'sec-1',
  slug: 'backend',
  name: 'Backend',
  description: 'Backend studies',
  bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  iconClass: 'pi-server',
  active: true,
  order: 1,
};

describe('CourseSectionService', () => {
  let service: CourseSectionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseSectionService],
    });
    service = TestBed.inject(CourseSectionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list()', () => {
    it('should return mapped array from API response', () => {
      let result: CourseSection[] | undefined;

      service.list().subscribe((sections) => (result = sections));

      const req = http.expectOne(BASE);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: [mockSection] });

      expect(result).toEqual([mockSection]);
    });

    it('should return empty array when data is null/undefined', () => {
      let result: CourseSection[] | undefined;

      service.list().subscribe((sections) => (result = sections));

      const req = http.expectOne(BASE);
      req.flush({ success: true, data: null });

      expect(result).toEqual([]);
    });

    it('should return multiple sections', () => {
      const section2: CourseSection = { ...mockSection, id: 'sec-2', slug: 'devops', name: 'DevOps' };
      let result: CourseSection[] | undefined;

      service.list().subscribe((sections) => (result = sections));

      const req = http.expectOne(BASE);
      req.flush({ success: true, data: [mockSection, section2] });

      expect(result?.length).toBe(2);
      expect(result?.[1].slug).toBe('devops');
    });
  });

  describe('getById()', () => {
    it('should send GET and return the section', () => {
      let result: CourseSection | undefined;

      service.getById('sec-1').subscribe((s) => (result = s));

      const req = http.expectOne(`${BASE}/sec-1`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockSection });

      expect(result).toEqual(mockSection);
    });
  });

  describe('create()', () => {
    it('should send POST and return created section', () => {
      const dto: CreateCourseSectionDto = {
        slug: 'backend',
        name: 'Backend',
        description: 'Backend studies',
        bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        iconClass: 'pi-server',
        active: true,
        order: 1,
      };
      let result: CourseSection | undefined;

      service.create(dto).subscribe((s) => (result = s));

      const req = http.expectOne(BASE);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush({ success: true, data: mockSection });

      expect(result).toEqual(mockSection);
    });
  });

  describe('update()', () => {
    it('should send PUT and return updated section', () => {
      const dto: UpdateCourseSectionDto = {
        name: 'Backend Updated',
        description: 'Updated description',
        bannerColor: '#000',
        iconClass: 'pi-server',
        active: true,
        order: 2,
      };
      const updated: CourseSection = { ...mockSection, name: 'Backend Updated', order: 2 };
      let result: CourseSection | undefined;

      service.update('sec-1', dto).subscribe((s) => (result = s));

      const req = http.expectOne(`${BASE}/sec-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ success: true, data: updated });

      expect(result).toEqual(updated);
    });
  });

  describe('delete()', () => {
    it('should send DELETE request', () => {
      let completed = false;

      service.delete('sec-1').subscribe(() => (completed = true));

      const req = http.expectOne(`${BASE}/sec-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(completed).toBe(true);
    });
  });
});
