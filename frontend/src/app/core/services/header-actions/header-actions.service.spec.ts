import { TestBed } from '@angular/core/testing';

import { HeaderActionsService } from './header-actions.service';

describe('HeaderActionsService', () => {
  let service: HeaderActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HeaderActionsService] });
    service = TestBed.inject(HeaderActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and clear actions', () => {
    service.set([{ id: 'a', label: 'Ação', run: () => undefined }]);
    expect(service.actions().length).toBe(1);
    service.clear();
    expect(service.actions().length).toBe(0);
  });
});
