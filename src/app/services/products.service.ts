import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_VERSION_URL, CreateProductRequest, ProductDetails } from 'src/models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  dataChange: BehaviorSubject<ProductDetails[]> = new BehaviorSubject<ProductDetails[]>([]);
  public retrivingData: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.retrivingData = new BehaviorSubject<boolean>(false);
  }

  get data(): ProductDetails[] {
    return this.dataChange.value;
  }

  getValue(): Observable<boolean> {
    return this.retrivingData.asObservable();
  }
  setValue(newValue: boolean): void {
    this.retrivingData.next(newValue);
  }

  getAllProductsForStaff(): void {
    this.http
      .get<{ success: boolean; data: ProductDetails[] }>(`${environment.apiURL}${API_VERSION_URL}/staff/getProducts`, {
        headers: this.authenticationService.getHeaders(),
      })
      .subscribe(
        data => {
          const updatedRes = data.data.map(ele => {
            return {
              _id: ele._id,
              outOfStock: ele.outOfStock,
              updated: ele.updated,
              name: ele.name,
              userId: ele.userId,
              description: ele.description,
              price: ele.price,
              waitingTime: ele.waitingTime,
              created: ele.created,
            } as ProductDetails;
          });
          console.log(data);
          this.dataChange.next(updatedRes);
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

  createProduct({ name, description, price, waitingTime }: CreateProductRequest) {
    return this.http
      .post<{ success: boolean; data: ProductDetails }>(
        `${environment.apiURL}${API_VERSION_URL}/staff/addItem`,
        {
          name,
          description,
          price,
          waitingTime,
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

  updateStockStatus(productId: string, stockStatus: boolean) {
    return this.http
      .post<{ success: boolean; data: ProductDetails }>(
        `${environment.apiURL}${API_VERSION_URL}/staff/updateStockStatus/${productId}`,
        {
          stockStatus,
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
