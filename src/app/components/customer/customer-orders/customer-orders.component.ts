import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomerOrdersService } from 'src/app/services/customer-orders.service';
import { SUBJECTS_COUNT, TransformedOrders } from 'src/models/user.model';

const ELEMENT_DATA: TransformedOrders[] = [];

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
})
export class CustomerOrdersComponent implements OnInit {
  displayedColumns = [
    'productName',
    // 'userId',
    'created',
    'quantity',
    'price',
    'billAmount',
    'orderStatus',
  ];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  exampleDatabase!: CustomerOrdersService;
  dataSource!: ExampleDataSource;
  dataSourceUpdated = new MatTableDataSource(ELEMENT_DATA);
  index!: number;
  id: string = '';
  requestListStatus = false;
  subjectCount = SUBJECTS_COUNT;
  orderId: string = '';
  updatingProduct: string = '';
  constructor(public httpClient: HttpClient, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.exampleDatabase = new CustomerOrdersService(this.httpClient, this.authenticationService);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  transformISOStringToDate(isoString: string) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDate;
  }
}

export class ExampleDataSource extends DataSource<TransformedOrders> {
  filterChange = new BehaviorSubject('');
  requestlistStatusNew = false;
  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: TransformedOrders[] = [];
  renderedData: TransformedOrders[] = [];
  constructor(public exampleDatabase: CustomerOrdersService, public paginator: MatPaginator, public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<TransformedOrders[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllOrdersForUser();
    this.exampleDatabase
      .getValue()
      .pipe(startWith(null), delay(0))
      .subscribe(value => {
        this.requestlistStatusNew = value as boolean;
      });
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data.slice().filter((issue: TransformedOrders) => {
          const searchStr = (
            issue.orderId +
            issue.productName +
            issue.orderStatus +
            issue.price +
            issue.quantity +
            issue.orderStatus
          ).toLowerCase();
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

  sortData(data: TransformedOrders[]): TransformedOrders[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | boolean = '';
      let propertyB: number | string | boolean = '';

      switch (this.sort.active) {
        case 'productName':
          [propertyA, propertyB] = [a.productName, b.productName];
          break;
        case 'quantity':
          [propertyA, propertyB] = [a.quantity, b.quantity];
          break;

        case 'price':
          [propertyA, propertyB] = [a.price, b.price];
          break;
        case 'billAmount':
          [propertyA, propertyB] = [a.billAmount, b.billAmount];
          break;
        case 'orderStatus':
          [propertyA, propertyB] = [a.orderStatus, b.orderStatus];
          break;
        case 'created':
          [propertyA, propertyB] = [a.created, b.created];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
