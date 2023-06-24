import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ICatalog } from 'src/app/types/catalog.interface';
import { DynamicTableComponent } from '../../dynamic-table/dynamic-table.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-catalog-products-data',
  templateUrl: './catalog-products-data.component.html',
  styleUrls: ['./catalog-products-data.component.scss'],
})
export class CatalogProductsDataComponent implements OnInit {
  catalog$ = new BehaviorSubject<ICatalog[]>([]);
  columns: Array<keyof ICatalog> = ['name', 'productType', 'description'];
  heads: Array<string> = ['Name', 'Type', 'Description'];
  isActionsActive: boolean = true;
  @ViewChild(DynamicTableComponent)
  dynamicTable!: DynamicTableComponent;

  constructor(
    private catalogService: CatalogService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.catalogService.getCatalogProducts().subscribe((catalog) => {
      this.catalog$.next(catalog);
    });
  }

  onCreateCatalogProduct = (newProduct: ICatalog) => {
    this.catalogService.createCatalogProduct(newProduct).subscribe((res) => {
      if (res) {
        const currentCatalogProducts = this.catalog$.getValue();
        currentCatalogProducts.push(res);
        this.catalog$.next(currentCatalogProducts);
      }
    });
  };

  onEditCatalogProduct = (updated: ICatalog) => {
    this.catalogService.editCatalogProduct(updated).subscribe((res) => {
      if (res) {
        const currentCatalogProducts = this.catalog$.getValue();
        const updatedProductIndex = currentCatalogProducts.findIndex(
          (catalogProduct) => catalogProduct.id === res.id
        );
        currentCatalogProducts[updatedProductIndex] = res;
        this.catalog$.next(currentCatalogProducts);
      }
    });
  };

  onDeleteCatalogProduct = (catalogProduct: ICatalog) => {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete the current entry?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.catalogService
            .deleteCatalogProduct(catalogProduct.id.toString())
            .subscribe((res) => {
              if (res.success) {
                const currentCatalogProducts = this.catalog$.getValue();
                const updatedCatalogProducts = currentCatalogProducts.filter(
                  (item) => item.id !== catalogProduct.id
                );
                this.catalog$.next(updatedCatalogProducts);
              }
            });
        }
      });
  };

  onTransferCatalogProduct = (catalogProduct: ICatalog) => {
    this.catalogService
      .deleteCatalogProduct(catalogProduct.id.toString())
      .subscribe((res) => {
        if (res.success) {
          const currentCatalogProducts = this.catalog$.getValue();
          const updatedCatalogProducts = currentCatalogProducts.filter(
            (item) => item.id !== catalogProduct.id
          );
          this.catalog$.next(updatedCatalogProducts);
        }
      });
  };
}
