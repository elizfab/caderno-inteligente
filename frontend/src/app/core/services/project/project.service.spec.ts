import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ProjectService,
} from './project.service';
import { environment } from '../../../environment/environment';
import { CreateProjectDto, Project, UpdateProjectDto } from '../../../shared/types/project.interface';


const BASE = `${environment.apiUrl}/api/v1/projects`;

const mockProject: Project = {
  id: 'proj-1',
  name: 'Meu Projeto',
  type: 'pessoal',
  description: 'Um projeto de estudo',
  tags: ['angular', 'typescript'],
  repoUrl: 'https://github.com/user/repo',
  deployUrl: 'https://myapp.vercel.app',
  slug: 'meu-projeto',
  bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  active: true,
  order: 1,
};

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list()', () => {
    it('should add type=pessoal query param when called with "pessoal"', () => {
      service.list('pessoal').subscribe();

      const req = http.expectOne((r) => r.url === BASE);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('type')).toBe('pessoal');
      req.flush({ success: true, data: [] });
    });

    it('should add type=profissional query param when called with "profissional"', () => {
      service.list('profissional').subscribe();

      const req = http.expectOne((r) => r.url === BASE);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('type')).toBe('profissional');
      req.flush({ success: true, data: [] });
    });

    it('should send no type param when called without argument', () => {
      service.list().subscribe();

      const req = http.expectOne(BASE);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('type')).toBe(false);
      req.flush({ success: true, data: [] });
    });

    it('should return mapped array from API response', () => {
      let result: Project[] | undefined;

      service.list('pessoal').subscribe((p) => (result = p));

      const req = http.expectOne((r) => r.url === BASE);
      req.flush({ success: true, data: [mockProject] });

      expect(result).toEqual([mockProject]);
    });

    it('should return empty array when data is null/undefined', () => {
      let result: Project[] | undefined;

      service.list('pessoal').subscribe((p) => (result = p));

      const req = http.expectOne((r) => r.url === BASE);
      req.flush({ success: true, data: null });

      expect(result).toEqual([]);
    });
  });

  describe('create()', () => {
    it('should send POST and return created project', () => {
      const dto: CreateProjectDto = {
        name: 'Meu Projeto',
        type: 'pessoal',
        description: 'Um projeto de estudo',
        tags: ['angular'],
        slug: 'meu-projeto',
        bannerColor: '#4f46e5',
        active: true,
        order: 1,
      };
      let result: Project | undefined;

      service.create(dto).subscribe((p) => (result = p));

      const req = http.expectOne(BASE);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush({ success: true, data: mockProject });

      expect(result).toEqual(mockProject);
    });
  });

  describe('update()', () => {
    it('should send PUT and return updated project', () => {
      const dto: UpdateProjectDto = {
        name: 'Projeto Atualizado',
        description: 'Descrição nova',
        tags: ['angular', 'rxjs'],
        bannerColor: '#000',
        active: true,
        order: 2,
      };
      const updated: Project = { ...mockProject, name: 'Projeto Atualizado', order: 2 };
      let result: Project | undefined;

      service.update('proj-1', dto).subscribe((p) => (result = p));

      const req = http.expectOne(`${BASE}/proj-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ success: true, data: updated });

      expect(result).toEqual(updated);
    });
  });

  describe('delete()', () => {
    it('should send DELETE request', () => {
      let completed = false;

      service.delete('proj-1').subscribe(() => (completed = true));

      const req = http.expectOne(`${BASE}/proj-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(completed).toBe(true);
    });
  });
});
