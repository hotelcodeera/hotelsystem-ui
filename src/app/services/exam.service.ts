import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import {
  ExamListResponse,
  MOCK_EXAMS,
  MOCK_EXAM_REGISTRATION,
  StudentRegistrationResponse,
} from 'src/models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  dataChange: BehaviorSubject<StudentRegistrationResponse[]> = new BehaviorSubject<StudentRegistrationResponse[]>([]);
  public retrivingData: BehaviorSubject<boolean>;

  private _examId!: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.retrivingData = new BehaviorSubject<boolean>(false);
  }

  get examId(): string {
    return this._examId;
  }

  set examId(str: string) {
    this._examId = str;
  }

  get data(): StudentRegistrationResponse[] {
    return this.dataChange.value;
  }

  getValue(): Observable<boolean> {
    return this.retrivingData.asObservable();
  }
  setValue(newValue: boolean): void {
    this.retrivingData.next(newValue);
  }

  getAllRegisteredStudents(): void {
    this.http.get<StudentRegistrationResponse[]>('https://jsonplaceholder.typicode.com/posts').subscribe(
      data => {
        console.log(data);
        console.log('examId', this._examId);
        this.dataChange.next(MOCK_EXAM_REGISTRATION);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      },
      () => {
        console.log('complete get data api');
        this.setValue(true);
        this.retrivingData.subscribe(value => {
          console.log(value);
        });
      },
    );
  }

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
