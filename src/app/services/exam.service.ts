import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import {
  CreateExamRequest,
  Exam,
  ExamListResponse,
  MOCK_EXAMS,
  MOCK_EXAM_REGISTRATION,
  MOCK_STUDENT_REGISTRATION,
  MOCK_STUDENT_REGISTRATION_PENDING,
  MOCK_UNREGISTERED_USERS,
  RegisterStudentRequest,
  StudentGrade,
  StudentRegistrationDetailResponse,
  StudentRegistrationResponse,
  UnRegisteredStudents,
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

  createExam({ name, description }: CreateExamRequest) {
    return this.http
      .post<Exam>(
        `https://jsonplaceholder.typicode.com/posts`,
        {
          name,
          description,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => {
          return {
            _id: 'awefhhwabefb' + new Date().toISOString(),
            name,
            description,
            userId: this.authenticationService.getUserDetails()._id,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          };
        }),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }

  fetchUnRegisteredUsers(examId: string) {
    return this.http
      .get<UnRegisteredStudents[]>(`https://jsonplaceholder.typicode.com/posts`, {
        headers: this.authenticationService.getHeaders(),
      })
      .pipe(
        map(res => MOCK_UNREGISTERED_USERS),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }
  //this API is for Professor
  registerStudentForExam({ examId, userId }: RegisterStudentRequest) {
    return this.http
      .post<StudentRegistrationResponse>(
        `https://jsonplaceholder.typicode.com/posts`,
        {
          examId,
          userId,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => {
          return {
            _id: 'awefhhwabefb' + new Date().toISOString(),
            examId,
            userId,
            userName: 'awefaewf',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            studentGrades: [],
          };
        }),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }

  gradeStudent({ maths, physics, chemistry, examId, userId, requestId }: StudentGrade) {
    return this.http
      .post<StudentRegistrationResponse>(
        `https://jsonplaceholder.typicode.com/posts`,
        {
          maths,
          physics,
          chemistry,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => {
          return {
            _id: requestId,
            examId,
            userId,
            userName: 'awefaewf',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            studentGrades: [
              {
                subject: 'maths',
                grade: 3,
              },
              {
                subject: 'physics',
                grade: 5,
              },
              {
                subject: 'chemistry',
                grade: 2,
              },
            ],
          } as StudentRegistrationResponse; // cHange this res[onse] schema
        }),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }

  unRegisterStudent(requestId: string) {
    return this.http
      .post<{ result: string }>(
        `https://jsonplaceholder.typicode.com/posts`,
        {},
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => {
          return { status: 'SUCCESS' };
        }),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }
  //this API is for student
  fetchStudentRegistration(examId: string) {
    return this.http
      .get<StudentRegistrationDetailResponse>(`https://jsonplaceholder.typicode.com/posts`, {
        headers: this.authenticationService.getHeaders(),
      })
      .pipe(
        map(res => MOCK_STUDENT_REGISTRATION_PENDING),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }
  //this api is for student registration
  registerForExam(examId: string) {
    return this.http
      .post<StudentRegistrationResponse>(
        `https://jsonplaceholder.typicode.com/posts`,
        {
          examId,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => MOCK_STUDENT_REGISTRATION),
        catchError(err => {
          return throwError(() => console.log(err));
        }),
      );
  }
}
