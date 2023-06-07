import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AddProductComponent } from './add-product/add-product.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { StaffOrdersComponent } from './staff-orders/staff-orders.component';
import { UpdateOrderStatusComponent } from './update-order-status/update-order-status.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: StaffDashboardComponent,
  },
  {
    path: 'orders',
    component: StaffOrdersComponent,
  },
];

@NgModule({
  declarations: [StaffDashboardComponent, AddProductComponent, StaffOrdersComponent, UpdateOrderStatusComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule.forChild(routes), ReactiveFormsModule, FormsModule],
})
export class StaffModule {}
