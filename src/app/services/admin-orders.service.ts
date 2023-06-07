import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_VERSION_URL, StaffOrders, TransformedStaffOrders } from 'src/models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  dataChange: BehaviorSubject<TransformedStaffOrders[]> = new BehaviorSubject<TransformedStaffOrders[]>([]);
  public retrivingData: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.retrivingData = new BehaviorSubject<boolean>(false);
  }

  get data(): TransformedStaffOrders[] {
    return this.dataChange.value;
  }

  getValue(): Observable<boolean> {
    return this.retrivingData.asObservable();
  }
  setValue(newValue: boolean): void {
    this.retrivingData.next(newValue);
  }

  transformOrders(orders: StaffOrders[]): TransformedStaffOrders[] {
    let res: TransformedStaffOrders[] = [];
    orders.forEach(ele => {
      res = [
        ...res,
        ...ele.orders.map(val => {
          return {
            orderId: val._id,
            orderStatus: val.orderStatus,
            updated: val.updated,
            productId: val.productId,
            userId: val.userId,
            quantity: val.quantity,
            created: val.created,
            productName: ele.name,
            productDescription: ele.description,
            price: ele.price,
            billAmount: ele.price * val.quantity,
          } as TransformedStaffOrders;
        }),
      ];
    });
    return res;
  }

  getOrdersForStaff(): void {
    this.http
      .get<{ success: boolean; data: StaffOrders[] }>(
        `${environment.apiURL}${API_VERSION_URL}/professor/getAllOrders`,
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .subscribe(
        data => {
          console.log(data);
          if (data.data.length > 0) {
            const updatedRes = this.transformOrders(data.data);
            this.dataChange.next(updatedRes);
          } else {
            this.dataChange.next([]);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.error);
        },
        () => {
          console.log('complete get data api');
          this.setValue(true);
          this.retrivingData.subscribe(value => {
            console.log(value);
          });
        },
      );
  }

  updateOrderStatus(orderId: string, orderStatus: string) {
    return this.http
      .post<{ success: boolean; data: TransformedStaffOrders }>(
        `${environment.apiURL}${API_VERSION_URL}/professor/updateOrderStatus/${orderId}`,
        {
          orderStatus,
        },
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }
}
