import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { GraphService } from './graph.service';
import { AuthService } from '../../auth';

describe('GraphService', () => {

  let http = jasmine.createSpyObj('HttpClient', ['get']);
  let auth = jasmine.createSpyObj('AuthService', ['userId']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GraphService,
      {provide: HttpClient, useValue: http},
      {provide: AuthService, useValue: auth}
    ]
  }));

  it('should be created', () => {
    const service: GraphService = TestBed.get(GraphService);
    expect(service).toBeTruthy();
  });
});
