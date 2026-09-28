import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAppIcons } from '../../../shared/icons/icon.registry';

import { PainelFinanceiro } from './painel-financeiro';

describe('PainelFinanceiro', () => {
  let component: PainelFinanceiro;
  let fixture: ComponentFixture<PainelFinanceiro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFinanceiro],
      providers: [provideAppIcons(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFinanceiro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
