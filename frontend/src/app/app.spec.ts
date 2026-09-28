import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideAppIcons } from './shared/icons/icon.registry';
import { HealthService } from './core/services/health/health.service';

import { App } from './app';

const healthServiceMock = {
  check: jest.fn(() => of({ status: 'ok', service: 'test' })),
};

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideAppIcons(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HealthService, useValue: healthServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
