import { Injectable } from '@angular/core';
import { Observable, catchError, delay, throwError, map } from 'rxjs';
import { ICatalog } from '../types/catalog.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getCatalogProducts(): Observable<ICatalog[]> {
    return this.http
      .get<ICatalog[]>('https://localhost:7071/api/Catalog')
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  createCatalogProduct(catalogProduct: ICatalog): Observable<ICatalog> {
    return this.http
      .post<ICatalog>('https://localhost:7071/api/Catalog', catalogProduct)
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  editCatalogProduct(catalogProduct: ICatalog): Observable<ICatalog> {
    return this.http
      .put<ICatalog>('https://localhost:7071/api/Catalog', catalogProduct)
      .pipe(delay(300), catchError(this.errorHandler.bind(this)));
  }

  deleteCatalogProduct(id: string): Observable<any> {
    return this.http.delete(`https://localhost:7071/api/Catalog/${id}`).pipe(
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
