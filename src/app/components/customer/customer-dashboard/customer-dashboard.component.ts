import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerOrdersService } from 'src/app/services/customer-orders.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS, ProductDetails } from 'src/models/user.model';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  isLoading = true;
  productsList: ProductDetails[] = [];
  paymentHandler: any = null;
  constructor(
    private products: CustomerOrdersService,
    private snackBar: SnackbarWrapperService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.products.getProducts().subscribe(
      res => {
        this.productsList = res;
        this.isLoading = false;
      },
      err => {
        console.log(err);
        this.snackBar.openSnackBar(err?.error?.error || 'Unable to fetch Products', '');
      },
      () => {
        console.log('complete api');
      },
    );
    this.invokeStripe();
  }
  viewDetails(product: ProductDetails) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '400px';
    dialogConfig.width = '350px';
    dialogConfig.data = {
      type: 'ADD',
    };
    const registerUserDialog = this.dialog.open(OrderFormComponent, dialogConfig);
    registerUserDialog.afterClosed().subscribe((val: { status: string; data: number }) => {
      if (val.status === CANCEL_STATUS) {
        return;
      }
      this.initializePayment(val.data, product);
    });
  }

  initializePayment(quantity: number, product: ProductDetails) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51M7KDGSGZGmacY00sBJLGc6vBpYBdC7O8UnO5vTwa3WSrMRScHTP5U3J5LJnPeEESGtLsSUvs8foxI1ji9tEppUc00RAjyn4w8',
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
        this.checkout(product, quantity);
      },
    });
    paymentHandler.open({
      name: 'Hotel Code Era',
      description: `Payment for ${product.name}`,
      amount: product.price * quantity * 100,
    });
  }

  checkout(product: ProductDetails, quantity: number) {
    this.products.orderProduct(quantity, product._id).subscribe(
      ele => {
        this.isLoading = false;
        this.snackBar.openSnackBar(`${product.name} ordered successfully`, '');
      },
      err => {
        console.log(err);
        this.snackBar.openSnackBar(err?.error?.error || 'Unable to create Product', '');
      },
    );
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51M7KDGSGZGmacY00sBJLGc6vBpYBdC7O8UnO5vTwa3WSrMRScHTP5U3J5LJnPeEESGtLsSUvs8foxI1ji9tEppUc00RAjyn4w8',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
