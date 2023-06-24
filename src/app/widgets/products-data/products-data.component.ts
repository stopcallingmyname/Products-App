import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IProduct } from 'src/app/types/product.interface';
import { ProductService } from 'src/app/services/products.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-products-data',
  templateUrl: './products-data.component.html',
  styleUrls: ['./products-data.component.scss'],
})
export class ProductsDataComponent implements OnInit {
  products$ = new BehaviorSubject<IProduct[]>([]);
  columns: Array<keyof IProduct> = ['name', 'productType', 'description'];
  heads: Array<string> = ['Name', 'Type', 'Description'];
  isActionsActive: boolean = true;
  @ViewChild(DynamicTableComponent)
  dynamicTable!: DynamicTableComponent;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products$.next(products);
    });
  }

  onCreateProduct = (newProduct: IProduct) => {
    this.productService.createProduct(newProduct).subscribe((res) => {
      if (res) {
        const currentProducts = this.products$.getValue();
        currentProducts.push(res);
        this.products$.next(currentProducts);
      }
    });
  };

  onEditProduct = (updated: IProduct) => {
    this.productService.editProduct(updated).subscribe((res) => {
      if (res) {
        const currentProducts = this.products$.getValue();
        const updatedProductIndex = currentProducts.findIndex(
          (product) => product.id === res.id
        );
        currentProducts[updatedProductIndex] = res;
        this.products$.next(currentProducts);
      }
    });
  };

  onDeleteProduct = (product: IProduct) => {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete the current entry?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.productService
            .deleteProduct(product.id.toString())
            .subscribe((res) => {
              if (res.success) {
                const currentProducts = this.products$.getValue();
                const updatedProducts = currentProducts.filter(
                  (item) => item.id !== product.id
                );
                this.products$.next(updatedProducts);
              }
            });
        }
      });
  };

  onTransferProduct = (product: IProduct) => {
    this.productService
      .deleteProduct(product.id.toString())
      .subscribe((res) => {
        if (res.success) {
          const currentProducts = this.products$.getValue();
          const updatedProducts = currentProducts.filter(
            (item) => item.id !== product.id
          );
          this.products$.next(updatedProducts);
        }
      });
  };
}
