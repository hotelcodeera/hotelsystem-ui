import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ExamListResponse, MOCK_EXAMS } from 'src/models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  fetchExams() {
    return this.http
      .get<ExamListResponse[]>('https://jsonplaceholder.typicode.com/posts', {
        headers: this.authenticationService.getHeaders(),
      })
      .pipe(
        map(res => MOCK_EXAMS),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }
}
