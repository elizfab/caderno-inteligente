import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar, RouterModule.forRoot([])],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 navigation items', () => {
    expect(component.items.length).toBe(3);
  });

  it('should have correct item keys', () => {
    const keys = component.items.map((i) => i.key);
    expect(keys).toEqual(['dashboard', 'estudos-labs', 'projetos']);
  });

  it('should default to expanded', () => {
    expect(component.expanded).toBe(true);
  });

  it('should default activeItem to dashboard', () => {
    expect(component.activeItem).toBe('dashboard');
  });

  it('should return expanded sidebar width when expanded', () => {
    component.expanded = true;
    expect(component.sidebarWidth).toBe('var(--sidebar-width-expanded)');
  });

  it('should return collapsed sidebar width when collapsed', () => {
    component.expanded = false;
    expect(component.sidebarWidth).toBe('var(--sidebar-width-collapsed)');
  });

  // it('should emit toggleExpanded when toggle button is clicked', () => {
  //   const spy = jest.spyOn(component.toggleExpanded, 'emit');
  //   const button = fixture.nativeElement.querySelector('.toggleButton') as HTMLButtonElement;
  //   button.click();
  //   expect(spy).toHaveBeenCalled();
  // });

  it('should activate estudos-labs for /backend', () => {
    (component as any).updateActive('/backend');
    expect(component.activeItem).toBe('estudos-labs');
  });

  it('should activate estudos-labs for /devops', () => {
    (component as any).updateActive('/devops');
    expect(component.activeItem).toBe('estudos-labs');
  });

  it('should activate estudos-labs for /estudos-labs', () => {
    (component as any).updateActive('/estudos-labs');
    expect(component.activeItem).toBe('estudos-labs');
  });

  it('should activate projetos for /projetos/pessoais URL', () => {
    (component as any).updateActive('/projetos/pessoais');
    expect(component.activeItem).toBe('projetos');
  });

  it('should activate projetos for /rollout-service', () => {
    (component as any).updateActive('/rollout-service');
    expect(component.activeItem).toBe('projetos');
  });

  it('should activate dashboard for /dashboard', () => {
    (component as any).updateActive('/dashboard');
    expect(component.activeItem).toBe('dashboard');
  });
});
