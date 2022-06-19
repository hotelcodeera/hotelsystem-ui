import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { ACCESS_TOKEN, LoginResponse, MOCK_JWT, User, UserType } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedInAbs = this.isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  getUserDetails(): User {
    const userDetails = localStorage.getItem(ACCESS_TOKEN);
    if (userDetails) {
      return this.jwtHelper.decodeToken(localStorage.getItem(ACCESS_TOKEN) || '') as User;
    }
    return {
      _id: 'dummy',
      firstName: 'dummy',
      lastName: 'dummy',
      email: 'dummy',
      username: 'test',
      userType: UserType.Professor,
    };
  }

  setUserDetails(user: string) {
    localStorage.setItem(ACCESS_TOKEN, user);
    this.updateLoggedIn(true);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN);
  }

  logout() {
    if (this.isLoggedIn()) {
      localStorage.removeItem(ACCESS_TOKEN);
      this.updateLoggedIn(false);
      this.router.navigate(['/login']);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`https://jsonplaceholder.typicode.com/posts`, {
        email,
        password,
      })
      .pipe(
        map(res => {
          return { result: 'success', data: MOCK_JWT };
        }),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }

  updateLoggedIn(isLoggedIn: boolean = false) {
    this.isLoggedIn$.next(isLoggedIn);
  }

  getHeaders() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
