import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from 'src/app/services/exam.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit {
  isLoading = false;
  fetchingUsers = true;
  unRegisteredUsers: { value: string; name: string }[] = [];

  form: FormGroup = new FormGroup({
    selectedUser: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<AddStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private examService: ExamService,
    private snackbar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {
    this.examService.fetchUnRegisteredUsers(this.dataInfo.examId).subscribe(
      ele => {
        if (!ele.length) {
          this.fetchingUsers = false;
          return;
        }
        this.unRegisteredUsers = ele.map(res => {
          return { value: res.userId, name: res.userName };
        });
        this.fetchingUsers = false;
      },
      err => {
        console.log(err);
        this.snackbar.openSnackBar(err?.error?.error || 'Unable to fetch unregistered users', '');
        this.fetchingUsers = false;
      },
    );
  }

  create() {
    this.isLoading = true;
    this.examService
      .registerStudentForExam({ examId: this.dataInfo.examId, userId: this.form.get('selectedUser')?.value })
      .subscribe(
        ele => {
          this.snackbar.openSnackBar('User Registered Succesfully', '');
          this.dialogRef.close({ status: 'SUCCESS', data: ele });
          this.isLoading = false;
        },
        err => {
          console.log(err);
          this.snackbar.openSnackBar(err?.error?.error || 'Unable to register User', '');
          this.dialogRef.close({ status: CANCEL_STATUS });
        },
      );
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
