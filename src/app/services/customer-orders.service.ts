import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_VERSION_URL, CustomerOrders, ProductDetails, TransformedOrders } from 'src/models/user.model';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class CustomerOrdersService {
  dataChange: BehaviorSubject<TransformedOrders[]> = new BehaviorSubject<TransformedOrders[]>([]);
  public retrivingData: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.retrivingData = new BehaviorSubject<boolean>(false);
  }

  get data(): TransformedOrders[] {
    return this.dataChange.value;
  }

  getValue(): Observable<boolean> {
    return this.retrivingData.asObservable();
  }
  setValue(newValue: boolean): void {
    this.retrivingData.next(newValue);
  }

  transformOrders(orders: CustomerOrders[]): TransformedOrders[] {
    let res: TransformedOrders[] = [];
    orders.forEach(ele => {
      res = [
        ...res,
        {
          orderId: ele._id,
          orderStatus: ele.orderStatus,
          updated: ele.updated,
          productId: ele.productDetails._id,
          userId: ele.productDetails.userId,
          quantity: ele.quantity,
          created: ele.created,
          productName: ele.productDetails.name,
          productDescription: ele.productDetails.description,
          price: ele.productDetails.price,
          billAmount: ele.productDetails.price * ele.quantity,
        },
      ];
    });
    return res;
  }

  getAllOrdersForUser(): void {
    this.http
      .get<{ success: boolean; data: CustomerOrders[] }>(
        `${environment.apiURL}${API_VERSION_URL}/user/getAllUsersOrders`,
        {
          headers: this.authenticationService.getHeaders(),
        },
      )
      .subscribe(
        data => {
          if (data.data.length <= 0) {
            this.dataChange.next([]);
            return;
          }
          const updatedRes = this.transformOrders(data.data);
          this.dataChange.next(updatedRes);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.error);
        },
        () => {
          console.log('complete get data api');
          this.setValue(true);
        },
      );
  }

  getProducts() {
    return this.http
      .get<{ success: boolean; data: ProductDetails[] }>(`${environment.apiURL}${API_VERSION_URL}/user/getProducts`, {
        headers: this.authenticationService.getHeaders(),
      })
      .pipe(
        map(res => res.data),
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  orderProduct(quantity: number, productId: string) {
    return this.http
      .post<{ success: boolean; data: CustomerOrders }>(
        `${environment.apiURL}${API_VERSION_URL}/user/order/${productId}`,
        {
          quantity,
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
