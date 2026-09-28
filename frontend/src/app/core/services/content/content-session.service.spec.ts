import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContentSessionService } from './content-session.service';

describe('ContentSessionService', () => {
  let service: ContentSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
