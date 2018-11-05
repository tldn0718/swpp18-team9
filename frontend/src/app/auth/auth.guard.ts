import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url = state.url;
        return this.checkLoginStatus(url);
    }

    checkLoginStatus(attemptedUrl: string) {
        if(sessionStorage.getItem('login_status') == 'logged_in') {
            return true;
        } else {
            this.auth.redirectUrl = attemptedUrl;
            this.router.navigate(['/signin']);
        }
    }
}