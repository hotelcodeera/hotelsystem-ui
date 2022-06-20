import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from 'src/app/services/exam.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-unregister-student',
  templateUrl: './unregister-student.component.html',
  styleUrls: ['./unregister-student.component.scss'],
})
export class UnregisterStudentComponent implements OnInit {
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<UnregisterStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private examService: ExamService,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {}

  unRegister() {
    this.isLoading = true;
    this.examService.unRegisterStudent(this.dataInfo.reqId).subscribe(
      ele => {
        this.snackBar.openSnackBar('Student removed successfully', '');
        this.dialogRef.close({ status: 'SUCCESS' });
        this.isLoading = false;
      },
      err => {
        console.log(err);
        this.snackBar.openSnackBar(err?.error?.error || 'Unable to remove student', '');
        this.dialogRef.close({ status: CANCEL_STATUS });
      },
    );
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
