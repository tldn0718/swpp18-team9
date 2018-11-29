import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate(): boolean {
        return this.checkLoginStatus();
    }

    checkLoginStatus() {
        if(sessionStorage.getItem('login_status') == 'logged_in') {
            return true;
        } else {
            this.router.navigate(['/signin']);
        }
    }
}