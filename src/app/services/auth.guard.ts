import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.authenticationService.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.updateLoggedIn(isAuthenticated);
    return isAuthenticated;
  }
}
