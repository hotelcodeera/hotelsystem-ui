import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { StudentExamDetailsComponent } from './student-exam-details/student-exam-details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
  },
  {
    path: 'exam/:examId',
    component: StudentExamDetailsComponent,
  },
];

@NgModule({
  declarations: [StudentDashboardComponent, StudentExamDetailsComponent],
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(routes)],
})
export class StudentModule {}
