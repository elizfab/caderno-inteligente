import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CourseTopicService } from './course-topic.service';

describe('CourseTopicService', () => {
  let service: CourseTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CourseTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
