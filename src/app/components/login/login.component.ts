import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { LoginResponse, UserType } from 'src/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
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

  register() {
    this.router.navigate(['/register']);
    return;
  }

  submit() {
    this.loading = true;
    this.authenticationService.login(this.form.get('email')?.value, this.form.get('password')?.value).subscribe(
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
