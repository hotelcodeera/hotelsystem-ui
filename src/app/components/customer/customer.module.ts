import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { OrderFormComponent } from './order-form/order-form.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
  },
  {
    path: 'orders',
    component: CustomerOrdersComponent,
  },
];

@NgModule({
  declarations: [CustomerDashboardComponent, OrderFormComponent, CustomerOrdersComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule.forChild(routes), ReactiveFormsModule, FormsModule],
})
export class CustomerModule {}
