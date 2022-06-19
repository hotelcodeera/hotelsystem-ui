import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedInAbs = this.isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
}
