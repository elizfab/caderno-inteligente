import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppIcons } from '../../../icons/icon.registry';
import { RouterModule } from '@angular/router';
import { ProjectCardGrid, ProjectItem } from './project-card-grid';

const mockItems: ProjectItem[] = [
  {
    id: 1,
    title: 'Projeto A',
    description: 'Descrição A',
    tags: ['Angular', 'TypeScript'],
    iconClass: 'pi-desktop',
    bannerColor: 'linear-gradient(135deg, #c3002f, #dd0031)',
    repoUrl: 'https://github.com/example/a',
    deployUrl: 'https://a.example.com',
  },
  {
    id: 2,
    title: 'Projeto B',
    description: 'Descrição B',
    tags: ['Node.js'],
    iconClass: 'pi-server',
    bannerColor: 'linear-gradient(135deg, #047857, #059669)',
    detailRoute: '/projetos/b',
  },
];

describe('ProjectCardGrid', () => {
  let component: ProjectCardGrid;
  let fixture: ComponentFixture<ProjectCardGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardGrid, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardGrid);
    component = fixture.componentInstance;
    component.pageTitle = 'Projetos Pessoais';
    component.pageDescription = 'Meus projetos';
    component.items = mockItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const h1 = fixture.nativeElement.querySelector('.projectPage__title');
    expect(h1?.textContent).toContain('Projetos Pessoais');
  });

  it('should render a card for each item', () => {
    const cards = fixture.nativeElement.querySelectorAll('.projectCard');
    expect(cards.length).toBe(mockItems.length);
  });

  it('should extract accent color from gradient', () => {
    const color = component.getAccentColor(mockItems[0]);
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('should return fallback accent color when bannerColor has no hex', () => {
    const item = { ...mockItems[0], bannerColor: 'blue' };
    expect(component.getAccentColor(item)).toBe('#4f46e5');
  });

  it('should open external URL in new tab', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    component.openUrl('https://example.com');
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    openSpy.mockRestore();
  });

  it('should hide broken images on error', () => {
    const img = document.createElement('img');
    const event = { target: img } as unknown as Event;
    component.onImageError(event);
    expect(img.style.display).toBe('none');
  });

  it('should render eyebrow with StudyPanel text', () => {
    const eyebrow = fixture.nativeElement.querySelector('.projectPage__eyebrow');
    expect(eyebrow?.textContent?.trim()).toBe('StudyPanel');
  });
});
