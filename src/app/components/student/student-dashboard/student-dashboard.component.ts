import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/services/exam.service';
import { ExamListResponse } from 'src/models/user.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  isLoading = true;
  examsList: ExamListResponse[] = [];
  constructor(private router: Router, private examService: ExamService) {}

  ngOnInit(): void {
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
    this.router.navigate([`student/exam/${examId}`]);
  }
}