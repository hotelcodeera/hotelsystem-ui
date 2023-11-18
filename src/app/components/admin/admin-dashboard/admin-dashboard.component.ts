import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CANCEL_STATUS, UserType } from 'src/models/user.model';
import { AddUserTypeComponent } from '../add-user-type/add-user-type.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  hotelStaff = UserType.Staff;
  userType = UserType.User;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  createUser(userType: UserType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '500px';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      userType,
    };
    const addUser = this.dialog.open(AddUserTypeComponent, dialogConfig);
    addUser
      .afterClosed()
      .pipe()
      .subscribe(ele => {
        if (ele.status === CANCEL_STATUS) {
          return;
        }
      });
  }
}
