import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { ContentItemService } from '../../../core/services/content/content-item.service';

import { StudyDetailPageComponent } from './study-detail-page.component';

const contentItemServiceMock = {
  list: jest.fn(() => of([])),
  listAll: jest.fn(() => of([])),
  create: jest.fn(() => of({})),
  update: jest.fn(() => of({})),
  delete: jest.fn(() => of(undefined)),
};

describe('StudyDetailPageComponent', () => {
  let component: StudyDetailPageComponent;
  let fixture: ComponentFixture<StudyDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyDetailPageComponent],
      providers: [
        provideAppIcons(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContentItemService, useValue: contentItemServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyDetailPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
