import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let router = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router},
        AuthGuard,
      ]
    });
    guard = TestBed.get(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('#canActivate should return false when logged out', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    expect(guard.canActivate()).toBeFalsy();
  });

  it('#canActivate should return true when logged in', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('logged_in');
    expect(guard.canActivate()).toBeTruthy();
  });


});
