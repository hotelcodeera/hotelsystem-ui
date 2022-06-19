import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExamService } from 'src/app/services/exam.service';
import { CANCEL_STATUS, ExamListResponse, UserType } from 'src/models/user.model';
import { AddExamComponent } from '../add-exam/add-exam.component';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.scss'],
})
export class ProfessorDashboardComponent implements OnInit {
  isLoading = true;
  examsList: ExamListResponse[] = [];
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private examService: ExamService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const userDetails = this.authenticationService.getUserDetails();
    if (isLoggedIn) {
      if (userDetails.userType === UserType.User) {
        this.router.navigate(['/student/dashboard']);
        return;
      }
    }
    this.examService.fetchExams().subscribe(
      res => {
        this.examsList = res;
        this.isLoading = false;
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('complete api');
      },
    );
  }

  viewExam(examId: string) {
    console.log(examId, 'examId');
    this.router.navigate([`professor/exam/${examId}`]);
  }

  createExam() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '300px';
    dialogConfig.width = '400px';
    dialogConfig.data = {};
    const addExamDialog = this.dialog.open(AddExamComponent, dialogConfig);
    addExamDialog
      .afterClosed()
      .pipe()
      .subscribe(ele => {
        if (ele.status === CANCEL_STATUS) {
          return;
        }
        this.examsList.push(ele.data);
      });
  }
}
