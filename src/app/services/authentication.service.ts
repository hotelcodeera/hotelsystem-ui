import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ACCESS_TOKEN,
  API_VERSION_URL,
  CreateUserRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UserType,
} from 'src/models/user.model';

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
      userType: UserType.Staff,
    };
  }

  setUserDetails(user: string) {
    localStorage.setItem(ACCESS_TOKEN, user);
    this.updateLoggedIn(true);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return !!token && !this.jwtHelper.isTokenExpired(token);
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
      .post<LoginResponse>(`${environment.apiURL}${API_VERSION_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map(res => res || ''),
        catchError(err => {
          return throwError(() => err);
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

  createUser({ userType, username, firstName, lastName, email }: CreateUserRequest) {
    return this.http
      .post<User>(
        `${environment.apiURL}${API_VERSION_URL}/admin/addUser`,
        {
          email,
          userType,
          username,
          firstName,
          lastName,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        map(res => {
          return { success: true };
        }),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  register({ username, email, password, firstName, lastName }: RegisterRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiURL}${API_VERSION_URL}/auth/register`, {
        email,
        password,
        username,
        firstName,
        lastName,
      })
      .pipe(
        map(res => res || ''),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }
}
