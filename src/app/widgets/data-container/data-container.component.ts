import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { ProductsDataComponent } from '../products-data/products-data.component';
import { CatalogProductsDataComponent } from '../catalog-products-data/catalog-products-data/catalog-products-data.component';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss'],
})
export class DataContainerComponent {
  loading: boolean = false;
  // resize tables

  @ViewChild('leftTable') leftTableWrapper!: ElementRef;

  @ViewChild('rightTable', { static: true })
  rightTableWrapper!: ElementRef<any>;

  @ViewChild(ProductsDataComponent)
  leftTable!: ProductsDataComponent;
  @ViewChild(ProductsDataComponent)
  rightTable!: ProductsDataComponent;

  @ViewChildren('separator') separator!: any;
  leftTableWidth: number;
  rightTableWidth: number;
  isDragging: boolean = false;
  dataContainerWidth = this.elementRef.nativeElement.offsetWidth;

  constructor(
    private storage: LocalStorageService,
    private elementRef: ElementRef
  ) {}

  onSeparatorDragStart(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onSeparatorDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    let separatorPosition =
      event.clientX - this.leftTable.dynamicTable.getBoundingClientRect().left;

    const leftTableMinWidth = this.leftTable.dynamicTable.getMinWidth();
    if (separatorPosition <= leftTableMinWidth) return;

    const rightTableMinWidth = this.rightTable.dynamicTable.getMinWidth();
    const availableWidth =
      this.dataContainerWidth -
      separatorPosition -
      this.separator.first.nativeElement.offsetWidth;
    if (availableWidth <= rightTableMinWidth) return;

    this.leftTableWidth = separatorPosition;
    this.rightTableWidth = availableWidth;
  }

  @HostListener('document:mouseup')
  onSeparatorDragEnd(): void {
    this.isDragging = false;

    if (this.leftTableWidth && this.rightTableWidth) {
      this.storage.set('leftTableWidth', this.leftTableWidth.toString());
      this.storage.set('rightTableWidth', this.rightTableWidth.toString());
    }
  }

  ngAfterViewInit(): void {
    this.dataContainerWidth = this.elementRef.nativeElement.offsetWidth;
    this.getTableWidthsFromLocalStorage();
  }

  private getTableWidthsFromLocalStorage(): void {
    const storedLeftTableWidth = this.storage.get('leftTableWidth');
    const storedRightTableWidth = this.storage.get('rightTableWidth');
    if (storedLeftTableWidth && storedRightTableWidth) {
      requestAnimationFrame(() => {
        this.leftTableWidth = parseInt(storedLeftTableWidth);
        this.rightTableWidth = parseInt(storedRightTableWidth);
      });
    }
  }

  clearLS(): void {
    this.storage.clear();
  }
}
