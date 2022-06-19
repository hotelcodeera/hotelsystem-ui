import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AddExamComponent } from './add-exam/add-exam.component';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { ProfessorDashboardComponent } from './professor-dashboard/professor-dashboard.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { GradeStudentComponent } from './grade-student/grade-student.component';
import { UnregisterStudentComponent } from './unregister-student/unregister-student.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ProfessorDashboardComponent,
  },
  {
    path: 'exam/:examId',
    component: ExamDetailsComponent,
  },
];

@NgModule({
  declarations: [ProfessorDashboardComponent, ExamDetailsComponent, AddExamComponent, AddStudentComponent, GradeStudentComponent, UnregisterStudentComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule.forChild(routes), ReactiveFormsModule, FormsModule],
})
export class ProfessorModule {}
