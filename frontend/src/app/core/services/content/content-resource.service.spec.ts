import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContentResourceService } from './content-resource.service';

describe('ContentResourceService', () => {
  let service: ContentResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
