import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExamService } from 'src/app/services/exam.service';
import { ExamListResponse, UserType } from 'src/models/user.model';

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
        debugger;
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
}
