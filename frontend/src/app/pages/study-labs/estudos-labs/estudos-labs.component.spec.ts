import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EstudosLabsComponent } from './estudos-labs.component';
import { CourseSectionService } from '../../../core/services/course/course-section.service';
import { CourseSection } from '../../../shared/types/course.interface';

const mockSections: CourseSection[] = [
  {
    id: 'sec-1',
    slug: 'backend',
    name: 'Backend',
    description: 'Backend studies',
    bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    iconClass: 'pi-server',
    active: true,
    order: 1,
  },
  {
    id: 'sec-2',
    slug: 'devops',
    name: 'DevOps',
    description: 'DevOps studies',
    bannerColor: 'linear-gradient(135deg, #059669, #10b981)',
    iconClass: 'pi-cloud',
    active: true,
    order: 2,
  },
];

describe('EstudosLabsComponent', () => {
  let component: EstudosLabsComponent;
  let fixture: ComponentFixture<EstudosLabsComponent>;
  let mockSectionService: { list: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };

  beforeEach(async () => {
    mockSectionService = {
      list: jest.fn().mockReturnValue(of(mockSections)),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EstudosLabsComponent, RouterModule.forRoot([])],
      providers: [provideAppIcons(), provideHttpClient(), provideHttpClientTesting(), 
        { provide: CourseSectionService, useValue: mockSectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudosLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sectionService.list() on init', () => {
    expect(mockSectionService.list).toHaveBeenCalledTimes(1);
  });

  it('should populate items() with mapped card data when service returns sections', () => {
    expect(component.items().length).toBe(2);
    expect(component.items()[0].title).toBe('Backend');
    expect(component.items()[0].detailRoute).toBe('/backend');
    expect(component.items()[1].title).toBe('DevOps');
    expect(component.items()[1].detailRoute).toBe('/devops');
  });

  it('should set apiId from section.id on mapped cards', () => {
    expect(component.items()[0].apiId).toBe('sec-1');
    expect(component.items()[1].apiId).toBe('sec-2');
  });

  it('should set items() to empty when service returns empty array', () => {
    mockSectionService.list.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.items().length).toBe(0);
  });

  it('should set items() to empty when service errors', () => {
    mockSectionService.list.mockReturnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(component.items().length).toBe(0);
  });

  it('openCreateModal() should set modalVisible to true and reset form', () => {
    component.openCreateModal();
    expect(component.modalVisible).toBe(true);
    expect(component.form.name).toBe('');
    expect(component.form.slug).toBe('');
    expect(component.editingSection).toBeNull();
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

  it('saveSection() with empty name should set errorMessage and not call service', () => {
    component.form.name = '';
    component.form.slug = 'backend';
    component.saveSection();
    expect(component.errorMessage).toBeTruthy();
    expect(mockSectionService.create).not.toHaveBeenCalled();
  });

  it('saveSection() with empty slug should set errorMessage and not call service', () => {
    component.form.name = 'Backend';
    component.form.slug = '';
    component.saveSection();
    expect(component.errorMessage).toBeTruthy();
    expect(mockSectionService.create).not.toHaveBeenCalled();
  });

  it('saveSection() with valid form should call sectionService.create() and reload', () => {
    const created: CourseSection = { ...mockSections[0], id: 'sec-new' };
    mockSectionService.create.mockReturnValue(of(created));
    mockSectionService.list.mockReturnValue(of(mockSections));

    component.form.name = 'Backend';
    component.form.slug = 'backend';
    component.editingSection = null;
    component.saveSection();

    expect(mockSectionService.create).toHaveBeenCalledWith(component.form);
    expect(component.modalVisible).toBe(false);
    expect(mockSectionService.list).toHaveBeenCalledTimes(2);
  });

  it('should render page title in h1', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('Estudos e Labs');
  });
});
