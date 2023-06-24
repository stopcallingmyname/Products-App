import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorComponent } from './widgets/global-error/global-error.component';
import { DynamicTableComponent } from './widgets/dynamic-table/dynamic-table.component';
import { TableColumnsPipe } from './pipes/table-columns.pipe';
import { ProductsDataComponent } from './widgets/products-data/products-data.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonComponent } from './widgets/button/button/button.component';
import { FormsModule } from '@angular/forms';
import { MatConfirmDialogComponent } from './widgets/mat-confirm-dialog/mat-confirm-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CatalogProductsDataComponent } from './widgets/catalog-products-data/catalog-products-data/catalog-products-data.component';
import { DataContainerComponent } from './widgets/data-container/data-container.component';
import { MatNotificationDialogComponent } from './widgets/mat-notification-dialog/mat-notification-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalErrorComponent,
    DynamicTableComponent,
    TableColumnsPipe,
    ProductsDataComponent,
    ButtonComponent,
    MatConfirmDialogComponent,
    CatalogProductsDataComponent,
    DataContainerComponent,
    MatNotificationDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DragDropModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
