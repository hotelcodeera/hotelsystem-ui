import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminOrdersService } from 'src/app/services/admin-orders.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-update-order-status',
  templateUrl: './update-order-status.component.html',
  styleUrls: ['./update-order-status.component.scss'],
})
export class UpdateOrderStatusComponent implements OnInit {
  form: FormGroup = new FormGroup({
    orderStatus: new FormControl('', [Validators.required, Validators.maxLength(15)]),
  });
  isLoading = false;
  orderList: { value: string; name: string }[] = [
    { name: 'Pending', value: 'PENDING' },
    { name: 'Inprogress', value: 'INPROGRESS' },
    { name: 'Ready', value: 'READY' },
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateOrderStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private adminOrdersService: AdminOrdersService,
    private snackbar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      orderStatus: new FormControl(this.dataInfo?.orderStatus, [Validators.required, Validators.maxLength(15)]),
    });
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }

  updateOrderStatus() {
    this.isLoading = true;
    this.adminOrdersService.updateOrderStatus(this.dataInfo.orderId, this.form.get('orderStatus')?.value).subscribe(
      ele => {
        this.isLoading = false;
        this.dialogRef.close({ status: 'SUCCESS', data: ele });
      },
      err => {
        this.snackbar.openSnackBar(err?.error?.error || 'Unable to update product status', '');
        this.dialogRef.close({ status: CANCEL_STATUS });
      },
    );
  }
}
