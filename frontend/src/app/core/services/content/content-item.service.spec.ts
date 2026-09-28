import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContentItemService } from './content-item.service';

describe('ContentItemService', () => {
  let service: ContentItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
