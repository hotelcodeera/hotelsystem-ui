import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from 'src/app/services/exam.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-grade-student',
  templateUrl: './grade-student.component.html',
  styleUrls: ['./grade-student.component.scss'],
})
export class GradeStudentComponent implements OnInit {
  form: FormGroup = new FormGroup({
    maths: new FormControl('', [Validators.required]),
    physics: new FormControl('', [Validators.required]),
    chemistry: new FormControl('', [Validators.required]),
  });
  isLoading: boolean = false;

  grades = [
    { value: 1, name: '1' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
  ];

  constructor(
    public dialogRef: MatDialogRef<GradeStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: any,
    private examService: ExamService,
    private snackBar: SnackbarWrapperService,
  ) {}

  ngOnInit(): void {}

  gradeStudent() {
    this.isLoading = true;
    this.examService
      .gradeStudent({
        requestId: this.dataInfo.reqId,
        examId: this.dataInfo.examId,
        userId: this.dataInfo.userId,
        maths: this.form.get('maths')?.value,
        physics: this.form.get('physics')?.value,
        chemistry: this.form.get('chemistry')?.value,
      })
      .subscribe(
        ele => {
          this.dialogRef.close({ status: 'SUCCESS', data: ele });
          this.isLoading = false;
          this.snackBar.openSnackBar('Graded Successfully', '');
        },
        err => {
          console.log(err);
          this.snackBar.openSnackBar(err?.error?.error || 'Unable to grade student', '');
          this.dialogRef.close({ status: CANCEL_STATUS });
        },
      );
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
