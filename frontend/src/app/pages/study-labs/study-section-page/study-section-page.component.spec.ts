import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { CourseTopicService } from '../../../core/services/course/course-topic.service';

import { StudySectionPageComponent } from './study-section-page.component';

const topicServiceMock = {
  list: jest.fn(() => of([])),
  create: jest.fn(() => of({})),
  update: jest.fn(() => of({})),
  delete: jest.fn(() => of(undefined)),
};

describe('StudySectionPageComponent', () => {
  let component: StudySectionPageComponent;
  let fixture: ComponentFixture<StudySectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudySectionPageComponent],
      providers: [
        provideAppIcons(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CourseTopicService, useValue: topicServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudySectionPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty list (dados vêm do banco)', () => {
    expect(component.items()).toEqual([]);
  });
});
