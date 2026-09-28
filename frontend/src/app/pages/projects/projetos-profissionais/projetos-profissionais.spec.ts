import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Project } from '../../../shared/types/project.interface';
import { ProjectService } from '../../../core/services/project/project.service';
import { ProjetosProfissionais } from './projetos-profissionais';

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Rollout Service',
    type: 'profissional',
    description: 'Serviço de rollout de features',
    tags: ['go', 'kubernetes'],
    repoUrl: 'https://github.com/company/rollout',
    slug: 'rollout-service',
    bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    active: true,
    order: 1,
  },
  {
    id: 'proj-2',
    name: 'Observability Platform',
    type: 'profissional',
    description: 'Plataforma de observabilidade',
    tags: ['prometheus', 'grafana'],
    slug: 'observability-platform',
    bannerColor: 'linear-gradient(135deg, #dc2626, #ef4444)',
    active: true,
    order: 2,
  },
];

describe('ProjetosProfissionais', () => {
  let component: ProjetosProfissionais;
  let fixture: ComponentFixture<ProjetosProfissionais>;
  let mockProjectService: { list: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };

  beforeEach(async () => {
    mockProjectService = {
      list: jest.fn().mockReturnValue(of(mockProjects)),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProjetosProfissionais, RouterModule.forRoot([])],
      providers: [provideAppIcons(), provideHttpClient(), provideHttpClientTesting(), 
        { provide: ProjectService, useValue: mockProjectService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetosProfissionais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call projectService.list("profissional") on init', () => {
    expect(mockProjectService.list).toHaveBeenCalledWith('profissional');
  });

  it('should populate items() with mapped data when service returns projects', () => {
    expect(component.items().length).toBe(2);
    expect(component.items()[0].title).toBe('Rollout Service');
    expect(component.items()[1].title).toBe('Observability Platform');
  });

  it('should map bannerColor from API to card item', () => {
    expect(component.items()[0].bannerColor).toBe('linear-gradient(135deg, #4f46e5, #7c3aed)');
    expect(component.items()[1].bannerColor).toBe('linear-gradient(135deg, #dc2626, #ef4444)');
  });

  it('should set apiId from project.id on mapped cards', () => {
    expect(component.items()[0].apiId).toBe('proj-1');
    expect(component.items()[1].apiId).toBe('proj-2');
  });

  it('should set items() to empty when service returns empty array', () => {
    mockProjectService.list.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.items().length).toBe(0);
  });

  it('should set items() to empty when service errors', () => {
    mockProjectService.list.mockReturnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(component.items().length).toBe(0);
  });

  it('openCreateModal() should set modalVisible to true', () => {
    component.openCreateModal();
    expect(component.modalVisible).toBe(true);
  });

  it('openCreateModal() should reset form fields and clear editingProject', () => {
    component.form.name = 'Old Name';
    component.openCreateModal();
    expect(component.form.name).toBe('');
    expect(component.form.type).toBe('profissional');
    expect(component.editingProject).toBeNull();
  });

  it('openCreateModal() should clear errorMessage', () => {
    component.errorMessage = 'previous error';
    component.openCreateModal();
    expect(component.errorMessage).toBe('');
  });

  it('cancelModal() should set modalVisible to false', () => {
    component.modalVisible = true;
    component.cancelModal();
    expect(component.modalVisible).toBe(false);
  });

  it('cancelModal() should clear errorMessage', () => {
    component.errorMessage = 'some error';
    component.cancelModal();
    expect(component.errorMessage).toBe('');
  });

  it('saveProject() with empty name should set errorMessage and not call service', () => {
    component.form.name = '';
    component.saveProject();
    expect(component.errorMessage).toBeTruthy();
    expect(mockProjectService.create).not.toHaveBeenCalled();
  });

  it('saveProject() with valid name should call projectService.create()', () => {
    const created: Project = { ...mockProjects[0], id: 'proj-new' };
    mockProjectService.create.mockReturnValue(of(created));
    mockProjectService.list.mockReturnValue(of(mockProjects));

    component.form.name = 'Novo Projeto';
    component.editingProject = null;
    component.saveProject();

    expect(mockProjectService.create).toHaveBeenCalled();
    expect(component.modalVisible).toBe(false);
  });

  it('saveProject() with valid form should reload the projects list', () => {
    const created: Project = { ...mockProjects[0], id: 'proj-new' };
    mockProjectService.create.mockReturnValue(of(created));
    mockProjectService.list.mockReturnValue(of(mockProjects));

    component.form.name = 'Novo Projeto';
    component.saveProject();

    expect(mockProjectService.list).toHaveBeenCalledTimes(2);
  });

  it('should render page title in h1', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('Projetos Profissionais');
  });
});
