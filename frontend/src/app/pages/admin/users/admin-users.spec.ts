import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideAppIcons } from '../../../shared/icons/icon.registry';
import { UserService } from '../../../core/services/user/user.service';

import { AdminUsers } from './admin-users';

const userServiceMock = {
  list: jest.fn(() => of([])),
  stats: jest.fn(() => of({ total: 0, active: 0, pending: 0, blocked: 0 })),
  get: jest.fn(() => of(null)),
  approve: jest.fn(() => of(null)),
  block: jest.fn(() => of(null)),
  unblock: jest.fn(() => of(null)),
  remove: jest.fn(() => of(null)),
  audit: jest.fn(() => of([])),
};

describe('AdminUsers', () => {
  let component: AdminUsers;
  let fixture: ComponentFixture<AdminUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsers],
      providers: [
        provideAppIcons(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map status severities', () => {
    expect(component.statusSeverity('active')).toBe('success');
    expect(component.statusSeverity('pending')).toBe('warn');
    expect(component.statusSeverity('blocked')).toBe('danger');
  });

  it('should load users on init', () => {
    expect(userServiceMock.list).toHaveBeenCalled();
  });
});
