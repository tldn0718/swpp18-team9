import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  redirectUrl: string;

  user: any;

  constructor(private http: HttpClient) { 
    if(!document.cookie) this.getToken().subscribe();
  }

  get userId() {
    if(this.user) return this.user.id;
    else return sessionStorage.getItem('login_user_id');
  }

  getToken() {
    return this.http.get('/api/token/');
  }

  signIn(username:string, password: string) {
    console.log(username, password);
    return this.http.post('/api/signin/', {username, password}).pipe(
      tap((user: any)=>{ 
        sessionStorage.setItem('login_status', 'logged_in');
        sessionStorage.setItem('login_user_id', user.id);
        console.log('logged in as:', user);
        this.user = user;
      })
    );
  }

  signUp(username: string, password: string, firstName: string, lastName: string) {
    const signUpInfo = {username, password, firstName, lastName};
    return this.http.post('/api/signup/', signUpInfo);
  }

  signOut() {
    return this.http.get('/api/signout/').pipe(
      tap(()=>{
        sessionStorage.removeItem('login_status');
        sessionStorage.removeItem('login_user_id');
      })
    );
  }
}
