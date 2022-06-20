import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-add-user-type',
  templateUrl: './add-user-type.component.html',
  styleUrls: ['./add-user-type.component.scss'],
})
export class AddUserTypeComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', []),
    lastName: new FormControl(''),
  });
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddUserTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private authenticationService: AuthenticationService,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {}

  createUser() {
    this.isLoading = true;
    this.authenticationService
      .createUser({
        username: this.form.get('username')?.value,
        email: this.form.get('email')?.value,
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value,
        userType: this.dataInfo.userType,
      })
      .subscribe(
        ele => {
          console.log(ele);
          this.dialogRef.close({ status: 'success' });
          this.isLoading = false;
          this.snackBar.openSnackBar('User Created Sucesfully', '');
        },
        err => {
          console.log(err);
          this.snackBar.openSnackBar(err?.error?.error || 'Unable to create user', '');
          this.dialogRef.close({ status: CANCEL_STATUS });
        },
      );
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
