import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserType } from 'src/models/user.model';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.scss'],
})
export class ProfessorDashboardComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const userDetails = this.authenticationService.getUserDetails();
    if (isLoggedIn) {
      if (userDetails.userType === UserType.User) {
        this.router.navigate(['/student/dashboard']);
        return;
      }
    }
  }
}
