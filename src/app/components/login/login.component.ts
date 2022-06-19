import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
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

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.authenticationService.logout();
  }

  submit() {
    this.loading = true;
    this.authenticationService.login(this.form.get('email')?.value, this.form.get('password')?.value).subscribe(
      (data: LoginResponse) => {
        console.log(data);
        this.authenticationService.setUserDetails(data.data);
        const userDetails = this.authenticationService.getUserDetails();
        if (userDetails.userType === UserType.Professor) {
          this.router.navigate(['/professor/dashboard']);
          return;
        }
        if (userDetails.userType === UserType.User) {
          this.router.navigate(['/student/dashboard']);
          return;
        }
      },
      err => {
        this.loading = false;
        console.log(err);
      },
      () => {
        console.log('complete');
      },
    );
  }
}
