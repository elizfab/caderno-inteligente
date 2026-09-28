import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAppIcons } from '../../icons/icon.registry';

import { RegisterModal } from './register-modal';

describe('RegisterModal', () => {
  let component: RegisterModal;
  let fixture: ComponentFixture<RegisterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterModal],
      providers: [provideAppIcons(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close', () => {
    component.open();
    expect(component.visible()).toBe(true);
    component.close();
    expect(component.visible()).toBe(false);
  });
});
