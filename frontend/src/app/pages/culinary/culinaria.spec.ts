import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAppIcons } from '../../shared/icons/icon.registry';

import { Culinaria } from './culinaria';

describe('Culinaria', () => {
  let component: Culinaria;
  let fixture: ComponentFixture<Culinaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Culinaria],
      providers: [provideAppIcons(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Culinaria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
