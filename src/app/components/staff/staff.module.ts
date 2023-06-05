import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: StaffDashboardComponent,
  },
];

@NgModule({
  declarations: [StaffDashboardComponent, AddProductComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule.forChild(routes), ReactiveFormsModule, FormsModule],
})
export class StaffModule {}
