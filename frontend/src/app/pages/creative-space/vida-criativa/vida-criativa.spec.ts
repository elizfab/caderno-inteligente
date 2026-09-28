import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAppIcons } from '../../../shared/icons/icon.registry';

import { VidaCriativa } from './vida-criativa';

describe('VidaCriativa', () => {
  let component: VidaCriativa;
  let fixture: ComponentFixture<VidaCriativa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VidaCriativa],
      providers: [provideAppIcons(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VidaCriativa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
