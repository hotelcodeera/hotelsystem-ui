import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddUserTypeComponent } from './add-user-type/add-user-type.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
];

@NgModule({
  declarations: [AdminDashboardComponent, AddUserTypeComponent],
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
