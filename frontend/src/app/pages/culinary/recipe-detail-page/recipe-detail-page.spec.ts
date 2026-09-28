import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { CulinaryService } from '../../../core/services/culinary.service';

import { RecipeDetailPageComponent } from './recipe-detail-page';

const culinaryServiceMock = {
  listCategories: jest.fn(() => of([])),
  getCategoryById: jest.fn(() => of(null)),
  createCategory: jest.fn(() => of(null)),
  updateCategory: jest.fn(() => of(null)),
  deleteCategory: jest.fn(() => of(undefined)),
  listRecipes: jest.fn(() => of([])),
  getRecipeById: jest.fn(() => of(null)),
  createRecipe: jest.fn(() => of(null)),
  updateRecipe: jest.fn(() => of(null)),
  deleteRecipe: jest.fn(() => of(undefined)),
};

describe('RecipeDetailPageComponent', () => {
  let component: RecipeDetailPageComponent;
  let fixture: ComponentFixture<RecipeDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetailPageComponent],
      providers: [
        provideAppIcons(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CulinaryService, useValue: culinaryServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
