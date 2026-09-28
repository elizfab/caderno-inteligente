import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContentNoteService } from './content-note.service';

describe('ContentNoteService', () => {
  let service: ContentNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
