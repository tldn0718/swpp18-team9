import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {

  let http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  http.get.and.returnValue(of(null));

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthService,
      {provide: HttpClient, useValue: http}
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
