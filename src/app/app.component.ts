import { Component } from '@angular/core';
import { UserType } from 'src/models/user.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hotel-code-era';

  menuItems: { link: string; text: string }[] = [];

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.authenticationService.isLoggedInAbs.subscribe(data => {
      if (!data) {
        this.menuItems = [];
        return;
      }

      const isLoggedIn = this.isLoggedIn;
      const userDetails = this.authenticationService.getUserDetails();

      if (isLoggedIn) {
        if (userDetails.userType === UserType.User) {
          this.menuItems = [
            {
              link: '/customer/dashboard',
              text: 'Home',
            },
            {
              link: '/customer/orders',
              text: 'Orders',
            },
          ];
          return;
        }
        if (userDetails.userType === UserType.Staff) {
          this.menuItems = [
            {
              link: '/staff/dashboard',
              text: 'Home',
            },
            {
              link: '/staff/orders',
              text: 'Orders',
            },
          ];
          return;
        }

        if (userDetails.userType === UserType.Admin) {
          this.menuItems = [
            {
              link: '/admin/dashboard',
              text: 'Home',
            },
          ];
          return;
        }
      }
    });
  }

  get isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  logout() {
    this.authenticationService.logout();
  }
}
