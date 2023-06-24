import { Injectable } from '@angular/core';
import { Observable, catchError, delay, throwError, map } from 'rxjs';
import { IProduct } from '../types/product.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getProducts(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>('https://localhost:7071/api/Product')
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http
      .post<IProduct>('https://localhost:7071/api/Product', product)
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  editProduct(product: IProduct): Observable<IProduct> {
    return this.http
      .put<IProduct>('https://localhost:7071/api/Product', product)
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`https://localhost:7071/api/Product/${id}`).pipe(
      delay(300),
      catchError(this.errorHandler.bind(this)),
      map(() => {
        return { success: true };
      })
    );
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}
