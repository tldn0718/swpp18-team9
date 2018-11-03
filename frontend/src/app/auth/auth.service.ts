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
    this.http.get(environment.serverUrl+'/api/token').pipe(take(1)).subscribe((res)=>{
      // set csrf token
    });
  }

  signIn(email:string, password: string) {
<<<<<<< HEAD
    return this.http.post(SERVER_URL+'/api/signin/', {username: email, password});
  }

  signUp(email: string, password: string) {
    return this.http.post(SERVER_URL+'/api/signup/', {username: email, password});
=======
    return this.http.post(environment.serverUrl+'/api/signin', {username: email, password});
  }

  signUp(email: string, password: string) {
    return this.http.post(environment.serverUrl+'/api/signup', {username: email, password});
>>>>>>> c459c7529b9afeb956c48419b65cb4d22306f5c8
  }
}
