import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  isLoading = false;

  form: FormGroup = new FormGroup({
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  constructor(public dialogRef: MatDialogRef<OrderFormComponent>, @Inject(MAT_DIALOG_DATA) public dataInfo: any) {}

  ngOnInit(): void {}

  create() {
    this.isLoading = true;
    this.dialogRef.close({ status: 'SUCCESS', data: this.form.get('quantity')?.value });
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
