import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {

  let service: AuthService;

  let http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  http.get
    .withArgs('/api/token/').and.callFake(()=>{
      document.cookie = 'cookie';
      return of(null)
    })
    .withArgs('/api/signout/').and.returnValue(of(null));
  http.post
    .withArgs('/api/signin/', {username: '', password: ''}).and.returnValue(of({id: 1}))
    .withArgs('/api/signup/', {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    }).and.returnValue(of('signup_success'))

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: HttpClient, useValue: http}
      ]
    });
    service = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with cookie set', () => {
    document.cookie = '';
    let test = new AuthService(http);
  });

  it('#getToken should set browser cookie',()=>{
    service.getToken().subscribe(()=>{
      expect(document.cookie).toEqual('cookie');
    });
  });

  it('#signIn should set user and set user id and login status in sessionStorage', ()=>{
    service.signIn('', '').subscribe(()=>{
      expect(sessionStorage.getItem('login_status')).toBe('logged_in');
      expect(sessionStorage.getItem('login_user_id')).toBe('1');
      expect(service.user).toEqual({id:1});
    });
  });

  it('#signUp should return post observable to /api/signup', () => {
    service.signUp('','','','').subscribe((res)=>{
      expect(res).toBe('signup_success');
    });
  });

  it('#signout should remove login_status and login_user_id from sessionStorage',()=>{
    service.signOut().subscribe(()=>{
      expect(sessionStorage.getItem('login_status')).toBeFalsy();
      expect(sessionStorage.getItem('login_user_id')).toBeFalsy();
    });
  });

  it('#userId getter should return user id when user is set',()=>{
    service.user = {id: 1};
    expect(service.userId).toBe(1);
  });

  it('#userId getter should get id from sessionStorage when user is not set',()=>{
    sessionStorage.setItem('login_user_id', '1');
    expect(service.userId).toBe('1');
  });

});
