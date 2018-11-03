import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL } from '../../models';

import { take } from 'rxjs/operators';

@Injectable()
export class AuthService {

  token: string;

  constructor(private http: HttpClient) { }

  getToken() {
    this.http.get(SERVER_URL+'/api/token').pipe(take(1)).subscribe((res)=>{
      // set csrf token
    });
  }

  signIn(email:string, password: string) {
    return this.http.post(SERVER_URL+'/api/signin/', {username: email, password});
  }

  signUp(email: string, password: string) {
    return this.http.post(SERVER_URL+'/api/signup/', {username: email, password});
  }
}
