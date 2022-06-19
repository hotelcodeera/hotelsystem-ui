import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from 'src/app/services/exam.service';
import { CANCEL_STATUS } from 'src/models/user.model';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss'],
})
export class AddExamComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(25)]),
  });
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddExamComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInfo: MatDialogConfig<any>,
    private examService: ExamService,
  ) {}

  ngOnInit(): void {}

  create() {
    this.isLoading = true;
    this.examService
      .createExam({ name: this.form.get('name')?.value, description: this.form.get('description')?.value })
      .subscribe(ele => {
        this.isLoading = false;
        this.dialogRef.close({ status: 'SUCCESS', data: ele });
      });
  }

  cancel() {
    this.dialogRef.close({ status: CANCEL_STATUS });
  }
}
