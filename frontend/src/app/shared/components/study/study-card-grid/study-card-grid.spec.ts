import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppIcons } from '../../../icons/icon.registry';
import { RouterModule } from '@angular/router';
import { StudyCardGrid } from './study-card-grid';
import { StudyCardItem } from '../../types/content-template.interface';

const mockItems: StudyCardItem[] = [
  {
    id: 1,
    title: 'Backend',
    description: 'Desenvolvimento backend',
    bannerColor: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    iconClass: 'pi-server',
    skill: 'Backend',
    detailRoute: '/backend',
  },
  {
    id: 2,
    title: 'Devops',
    description: 'CI/CD e infraestrutura',
    bannerColor: 'linear-gradient(135deg, #374151, #6b7280)',
    iconClass: 'pi-cog',
    skill: 'DevOps',
    detailRoute: '/devops',
  },
];

describe('StudyCardGrid', () => {
  let component: StudyCardGrid;
  let fixture: ComponentFixture<StudyCardGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyCardGrid, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyCardGrid);
    component = fixture.componentInstance;
    component.pageTitle = 'Estudos';
    component.pageDescription = 'Área de estudos';
    component.items = mockItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const h1 = fixture.nativeElement.querySelector('.studyPage__title');
    expect(h1?.textContent).toContain('Estudos');
  });

  it('should render the page description', () => {
    const p = fixture.nativeElement.querySelector('.studyPage__description');
    expect(p?.textContent).toContain('Área de estudos');
  });

  it('should render a card for each item', () => {
    const cards = fixture.nativeElement.querySelectorAll('.studyCard');
    expect(cards.length).toBe(mockItems.length);
  });

  it('should extract accent color from gradient', () => {
    const color = component.getAccentColor(mockItems[0]);
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('should return fallback color when bannerColor has no hex', () => {
    const item = { ...mockItems[0], bannerColor: 'red' };
    expect(component.getAccentColor(item)).toBe('#4f46e5');
  });

  it('should render eyebrow with StudyPanel text', () => {
    const eyebrow = fixture.nativeElement.querySelector('.studyPage__eyebrow');
    expect(eyebrow?.textContent?.trim()).toBe('StudyPanel');
  });
});
