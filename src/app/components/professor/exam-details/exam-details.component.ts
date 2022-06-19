import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExamService } from 'src/app/services/exam.service';
import { CANCEL_STATUS, StudentRegistrationResponse, SUBJECTS_COUNT } from 'src/models/user.model';
import { AddStudentComponent } from '../add-student/add-student.component';
import { GradeStudentComponent } from '../grade-student/grade-student.component';
import { UnregisterStudentComponent } from '../unregister-student/unregister-student.component';

const ELEMENT_DATA: StudentRegistrationResponse[] = [];

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.scss'],
})
export class ExamDetailsComponent implements OnInit {
  displayedColumns = ['_id', 'userId', 'userName', 'actions'];

  exampleDatabase!: ExamService;
  dataSource!: ExampleDataSource;
  dataSourceUpdated = new MatTableDataSource(ELEMENT_DATA);
  index!: number;
  id: string = '';
  requestListStatus = false;
  subjectCount = SUBJECTS_COUNT;
  examId: string = '';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: ExamService,
    public httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(ele => {
      console.log(ele, 'paramChange');
      this.dataService.examId = ele['examId'];
      this.examId = ele['examId'];
      this.loadData();
    });
  }

  refresh() {
    this.loadData();
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  registerStudent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '300px';
    dialogConfig.width = '300px';
    dialogConfig.data = {
      examId: this.examId,
    };
    const registerStudentDialog = this.dialog.open(AddStudentComponent, dialogConfig);
    registerStudentDialog.afterClosed().subscribe(val => {
      if (val.status === CANCEL_STATUS) {
        return;
      }
      this.exampleDatabase.dataChange.next([...this.exampleDatabase.dataChange.value, val.data]);
      this.refreshTable();
    });
  }

  gradeStudent(userId: string, reqId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '400px';
    dialogConfig.width = '300px';
    dialogConfig.data = {
      examId: this.examId,
      userId,
      reqId,
    };
    const registerStudentDialog = this.dialog.open(GradeStudentComponent, dialogConfig);
    registerStudentDialog.afterClosed().subscribe(val => {
      if (val.status === CANCEL_STATUS) {
        return;
      }
      const data = this.exampleDatabase.dataChange.value;
      const dataIndex = data.findIndex(ele => ele._id === reqId);
      data[dataIndex] = val.data;
      this.exampleDatabase.dataChange.next(data);
      this.refreshTable();
    });
  }

  unRegisterStudent(reqId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '220px';
    dialogConfig.width = '350px';
    dialogConfig.data = {
      reqId,
    };
    const registerStudentDialog = this.dialog.open(UnregisterStudentComponent, dialogConfig);
    registerStudentDialog.afterClosed().subscribe(val => {
      if (val.status === CANCEL_STATUS) {
        return;
      }
      const data = this.exampleDatabase.dataChange.value;
      const filteredData = data.filter(ele => ele._id !== reqId);
      this.exampleDatabase.dataChange.next(filteredData);
      this.refreshTable();
    });
  }

  public loadData() {
    this.exampleDatabase = new ExamService(this.httpClient, this.authenticationService);
    this.exampleDatabase.examId = this.examId;
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
}

export class ExampleDataSource extends DataSource<StudentRegistrationResponse> {
  filterChange = new BehaviorSubject('');
  requestlistStatusNew = false;
  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: StudentRegistrationResponse[] = [];
  renderedData: StudentRegistrationResponse[] = [];
  constructor(public exampleDatabase: ExamService, public paginator: MatPaginator, public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<StudentRegistrationResponse[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllRegisteredStudents();
    this.exampleDatabase
      .getValue()
      .pipe(startWith(null), delay(0))
      .subscribe(value => {
        this.requestlistStatusNew = value as boolean;
      });
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data.slice().filter((issue: StudentRegistrationResponse) => {
          const searchStr = (issue._id + issue.userId + issue.userName).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
        this.requestlistStatusNew = true;
        return this.renderedData;
      }),
    );
  }

  disconnect(): void {}

  sortData(data: StudentRegistrationResponse[]): StudentRegistrationResponse[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | boolean = '';
      let propertyB: number | string | boolean = '';

      switch (this.sort.active) {
        case '_id':
          [propertyA, propertyB] = [a._id, b._id];
          break;
        case 'userId':
          [propertyA, propertyB] = [a.userId, b.userId];
          break;
        case 'userName':
          [propertyA, propertyB] = [a.userName, b.userName];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
