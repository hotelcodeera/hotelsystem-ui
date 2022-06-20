import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExamService } from 'src/app/services/exam.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { StudentRegistrationDetailResponse } from 'src/models/user.model';

@Component({
  selector: 'app-student-exam-details',
  templateUrl: './student-exam-details.component.html',
  styleUrls: ['./student-exam-details.component.scss'],
})
export class StudentExamDetailsComponent implements OnInit {
  isNotRegistered = false;
  examId = '';
  examDetails!: StudentRegistrationDetailResponse;
  isLoading = true;
  registering = false;

  constructor(
    private examService: ExamService,
    private activatedRoute: ActivatedRoute,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(res => this.examService.fetchStudentRegistration(res['examId'] as string)))
      .subscribe(ele => {
        this.examDetails = ele;
        this.isLoading = false;
      });
  }

  registerExam() {
    this.registering = true;
    this.examService.registerForExam(this.examDetails.examId).subscribe(
      ele => {
        this.examDetails = ele;
        this.registering = false;
        this.snackBar.openSnackBar('Registerred Successfully', '');
      },
      err => {
        console.log(err);
        this.snackBar.openSnackBar(err?.error?.error || 'Unable to register exam', '');
      },
    );
  }
}
