import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from 'src/app/services/exam.service';
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
  ) {}

  ngOnInit(): void {}

  unRegister() {
    this.isLoading = true;
    this.examService.unRegisterStudent(this.dataInfo.reqId).subscribe(ele => {
      this.dialogRef.close({ status: 'SUCCESS' });
      this.isLoading = false;
    });
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
