import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { ProfessorDashboardComponent } from './professor-dashboard/professor-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ProfessorDashboardComponent,
  },
];

@NgModule({
  declarations: [ProfessorDashboardComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule.forChild(routes)],
})
export class ProfessorModule {}
