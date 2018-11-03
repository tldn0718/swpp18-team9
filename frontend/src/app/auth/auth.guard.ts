import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('AuthGuard#canActivate called');
        const url = state.url;
        return this.checkLoginStatus(url);
    }

    checkLoginStatus(attemptedUrl: string) {
        if(this.auth.token) {
            return true;
        } else {
            this.auth.redirectUrl = attemptedUrl;
            this.router.navigate(['/signin']);
        }
    }
}