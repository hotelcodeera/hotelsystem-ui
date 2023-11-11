import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { LoginResponse, UserType } from 'src/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    lastName: new FormControl('', []),
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  hide = true;
  loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {
    this.authenticationService.logout();
  }

  submit() {
    this.loading = true;
    this.authenticationService
      .register({
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value,
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        username: this.form.get('username')?.value,
      })
      .subscribe(
        (data: LoginResponse) => {
          console.log(data);
          this.authenticationService.setUserDetails(data.token);
          const userDetails = this.authenticationService.getUserDetails();
          if (userDetails.userType === UserType.Staff) {
            this.router.navigate(['/staff/dashboard']);
            return;
          }
          if (userDetails.userType === UserType.User) {
            this.router.navigate(['/customer/dashboard']);
            return;
          }
          if (userDetails.userType === UserType.Admin) {
            this.router.navigate(['/admin/dashboard']);
            return;
          }
        },
        err => {
          this.loading = false;
          console.log(err);
          this.snackBar.openSnackBar(err.error.error, '');
        },
        () => {
          console.log('complete');
        },
      );
  }
}
