import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  token: string;
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  getToken() {
    return this.http.get('/api/token/');
  }

  signIn(username:string, password: string) {
    if(document.cookie) {
      return this.http.post('/api/signin/', {username, password});
    }
    else {
      this.getToken().pipe(
        concatMap(()=>{
          return this.http.post('/api/signin/', {username, password});
        })
      );
    }
  }

  signUp(username: string, password: string, firstName: string, lastName: string) {
    const signUpInfo = {username, password, firstName, lastName};
    return this.http.post('/api/signup/', signUpInfo);
  }
}
