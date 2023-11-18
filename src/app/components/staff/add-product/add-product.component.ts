import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    price: new FormControl(0, [Validators.required, Validators.maxLength(25)]),
    waitingTime: new FormControl(0, [Validators.required, Validators.maxLength(25)]),
  });
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private productService: ProductsService,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {
    if (this.dataInfo.type === 'EDIT') {
      this.form = new FormGroup({
        name: new FormControl(this.dataInfo.name, [Validators.required, Validators.maxLength(15)]),
        description: new FormControl(this.dataInfo.description, [Validators.required, Validators.maxLength(25)]),
        price: new FormControl(this.dataInfo.price, [Validators.required, Validators.maxLength(25)]),
        waitingTime: new FormControl(this.dataInfo.waitingTime, [Validators.required, Validators.maxLength(25)]),
      });
    }
  }

  create() {
    this.isLoading = true;
    if (this.dataInfo.type === 'EDIT') {
      this.edit();
      return;
    }
    this.productService
      .createProduct({
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        price: this.form.get('price')?.value,
        waitingTime: this.form.get('waitingTime')?.value,
      })
      .subscribe(
        ele => {
          this.isLoading = false;
          this.dialogRef.close({ status: 'SUCCESS', data: ele });
        },
        err => {
          console.log(err);
          this.snackBar.openSnackBar(err?.error?.error || 'Unable to create product', '');
          this.dialogRef.close({ status: CANCEL_STATUS });
        },
      );
  }
  edit() {}

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
