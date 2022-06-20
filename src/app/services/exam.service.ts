import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateExamRequest,
  Exam,
  ExamListResponse,
  MOCK_STUDENT_REGISTRATION,
  MOCK_STUDENT_REGISTRATION_PENDING,
  RegisterStudentRequest,
  StudentGrade,
  StudentRegistrationDetailResponse,
  StudentRegistrationResponse,
  StudentRegistrationResponseWithUser,
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
    this.http
      .get<{ success: boolean; data: StudentRegistrationResponseWithUser[] }>(
        `${environment.apiURL}api/v1/professor/fetchRegistrations/${this._examId}`,
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .subscribe(
        data => {
          const updatedRes = data.data.map(ele => {
            return {
              _id: ele._id,
              created: ele.created,
              updated: ele.updated,
              userId: ele.userDetails._id,
              userName: ele.userDetails.username,
              studentGrades: ele.studentGrades,
              examId: ele.examId,
            } as StudentRegistrationResponse;
          });
          console.log(data);
          console.log('examId', this._examId);
          this.dataChange.next(updatedRes);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.error);
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
      .get<{ success: boolean; data: ExamListResponse[] }>(`${environment.apiURL}api/v1/professor/getExams`, {
        headers: this.authenticationService.getHeaders(),
      })
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  createExam({ name, description }: CreateExamRequest) {
    return this.http
      .post<{ success: boolean; data: Exam }>(
        `${environment.apiURL}api/v1/professor/addExam`,
        {
          name,
          description,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  fetchUnRegisteredUsers(examId: string) {
    return this.http
      .get<{ success: boolean; data: UnRegisteredStudents[] }>(
        `${environment.apiURL}api/v1/professor/fetchUnRegisterStudents/${examId}`,
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }
  //this API is for Professor
  registerStudentForExam({ examId, userId }: RegisterStudentRequest) {
    return this.http
      .post<{ success: boolean; data: StudentRegistrationResponse }>(
        `${environment.apiURL}api/v1/professor/register`,
        {
          examId,
          userId,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  gradeStudent({ maths, physics, chemistry, examId, userId, requestId }: StudentGrade) {
    return this.http
      .post<{ success: boolean; data: StudentRegistrationResponseWithUser }>(
        `${environment.apiURL}api/v1/professor/gradeStudent/${requestId}`,
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
            _id: res.data._id,
            examId,
            userId,
            userName: res.data.userDetails.username,
            created: res.data.created,
            updated: res.data.updated,
            studentGrades: res.data.studentGrades,
          } as StudentRegistrationResponse; // cHange this res[onse] schema
        }),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  unRegisterStudent(requestId: string) {
    return this.http
      .post<{ result: string }>(
        `${environment.apiURL}api/v1/professor/removeRegistration/${requestId}`,
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
          return throwError(() => err);
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
