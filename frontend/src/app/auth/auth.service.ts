import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  redirectUrl: string;

  constructor(private http: HttpClient) { 
    if(!document.cookie) this.getToken().subscribe();
  }

  getToken() {
    return this.http.get('/api/token/');
  }

  signIn(username:string, password: string) {
    return this.http.post('/api/signin/', {username, password}).pipe(
      tap(()=>{ sessionStorage.setItem('login_status', 'logged_in') })
    );
  }

  signUp(username: string, password: string, firstName: string, lastName: string) {
    const signUpInfo = {username, password, firstName, lastName};
    return this.http.post('/api/signup/', signUpInfo);
  }

  signOut() {
    return this.http.get('/api/signout/');
  }
}
