import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductsService } from 'src/app/services/products.service';
import { SnackbarWrapperService } from 'src/app/services/snackbar-wrapper.service';
import { CANCEL_STATUS, ProductDetails, SUBJECTS_COUNT, UserType } from 'src/models/user.model';
import { AddProductComponent } from '../add-product/add-product.component';

const ELEMENT_DATA: ProductDetails[] = [];

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss'],
})
export class StaffDashboardComponent implements OnInit {
  displayedColumns = ['_id', 'name', 'price', 'stockStatus', 'actions'];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  exampleDatabase!: ProductsService;
  dataSource!: ExampleDataSource;
  dataSourceUpdated = new MatTableDataSource(ELEMENT_DATA);
  index!: number;
  id: string = '';
  requestListStatus = false;
  subjectCount = SUBJECTS_COUNT;
  examId: string = '';
  updatingProduct: string = '';

  constructor(
    private snackBar: SnackbarWrapperService,
    private dataService: ProductsService,
    public httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const userDetails = this.authenticationService.getUserDetails();
    if (isLoggedIn) {
      if (userDetails.userType === UserType.User) {
        this.router.navigate(['/customer/dashboard']);
        return;
      }
    }
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  addProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '450px';
    dialogConfig.width = '350px';
    dialogConfig.data = {
      type: 'ADD',
    };
    const registerUserDialog = this.dialog.open(AddProductComponent, dialogConfig);
    registerUserDialog.afterClosed().subscribe((val: { status: string; data: ProductDetails }) => {
      if (val.status === CANCEL_STATUS) {
        return;
      }
      const data = this.exampleDatabase.dataChange.value;
      this.exampleDatabase.dataChange.next([...data, val.data]);
      this.refresh();
      this.refreshTable();
    });
  }

  updateStockStatus(productId: string, status: boolean, productDetails: ProductDetails) {
    this.updatingProduct = productId;
    this.dataService.updateStockStatus(productId, status).subscribe(
      ele => {
        const data = this.exampleDatabase.dataChange.value;
        const dataIndex = data.findIndex(ele => ele._id === productId);
        data[dataIndex] = { ...productDetails, outOfStock: status };
        this.exampleDatabase.dataChange.next(data);
        this.updatingProduct = '';
      },
      err => {
        console.log(err);
        this.snackBar.openSnackBar(err?.error?.error || 'Unable to update Product', '');
      },
    );
  }

  public loadData() {
    this.exampleDatabase = new ProductsService(this.httpClient, this.authenticationService);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
}

export class ExampleDataSource extends DataSource<ProductDetails> {
  filterChange = new BehaviorSubject('');
  requestlistStatusNew = false;
  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: ProductDetails[] = [];
  renderedData: ProductDetails[] = [];
  constructor(public exampleDatabase: ProductsService, public paginator: MatPaginator, public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<ProductDetails[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllProductsForStaff();
    this.exampleDatabase
      .getValue()
      .pipe(startWith(null), delay(0))
      .subscribe(value => {
        this.requestlistStatusNew = value as boolean;
      });
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data.slice().filter((issue: ProductDetails) => {
          const searchStr = (issue._id + issue.name + issue.description + issue.price).toLowerCase();
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

  sortData(data: ProductDetails[]): ProductDetails[] {
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
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'description':
          [propertyA, propertyB] = [a.description, b.description];
          break;

        case 'price':
          [propertyA, propertyB] = [a.price, b.price];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
