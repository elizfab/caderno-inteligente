import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppIcons } from '../../icons/icon.registry';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from './back-button';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonComponent, RouterModule.forRoot([])],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden for /dashboard', () => {
    (component as any).currentUrl.set('/dashboard');
    expect(component.visible()).toBe(false);
  });

  it('should be hidden for /estudos-labs', () => {
    (component as any).currentUrl.set('/estudos-labs');
    expect(component.visible()).toBe(false);
  });

  it('should be hidden for /projetos', () => {
    (component as any).currentUrl.set('/projetos');
    expect(component.visible()).toBe(false);
  });

  it('should be visible for /backend', () => {
    (component as any).currentUrl.set('/backend');
    expect(component.visible()).toBe(true);
  });

  it('should be visible for /projetos/pessoais', () => {
    (component as any).currentUrl.set('/projetos/pessoais');
    expect(component.visible()).toBe(true);
  });

  it('should be visible for nested routes', () => {
    (component as any).currentUrl.set('/backend/node/1');
    expect(component.visible()).toBe(true);
  });

  it('should navigate to parent route when URL has multiple segments', () => {
    (component as any).currentUrl.set('/backend/node');
    const navigateSpy = jest
      .spyOn((component as any).router, 'navigateByUrl')
      .mockResolvedValue(true);
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('/backend');
  });

  it('should call location.back() when URL has a single segment', () => {
    (component as any).currentUrl.set('/backend');
    const backSpy = jest
      .spyOn((component as any).location, 'back')
      .mockImplementation(() => {});
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should ignore query string when resolving parent route', () => {
    (component as any).currentUrl.set('/backend/node?tab=1');
    const navigateSpy = jest
      .spyOn((component as any).router, 'navigateByUrl')
      .mockResolvedValue(true);
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('/backend');
  });
});
