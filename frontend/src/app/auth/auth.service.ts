import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { take } from 'rxjs/operators';

@Injectable()
export class AuthService {

  token: string;
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  getToken() {
    this.http.get(environment.serverUrl+'/api/token/').pipe(take(1)).subscribe((res)=>{
      // set csrf token
    });
  }

  signIn(email:string, password: string) {
    return this.http.post(environment.serverUrl+'/api/signin/', {username: email, password});
  }

  signUp(email: string, password: string) {
    return this.http.post(environment.serverUrl+'/api/signup/', {username: email, password});
  }
}
