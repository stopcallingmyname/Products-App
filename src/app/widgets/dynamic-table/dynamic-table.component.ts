import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragExit,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { DialogService } from 'src/app/services/dialog.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent {
  @Input() tableId: string;
  @Input() title: string = 'Data';
  @Input() data: any[] = [];
  @Input() headerNames: string[] = [];
  @Input() onCreateData?: (...params: any) => void;
  @Input() onEditData?: (...params: any) => void;
  @Input() onDeleteData?: (...params: any) => void;
  @Input() onTransferData?: (...params: any) => void;
  headers: { name: string; value: string }[] = [];
  isActionsToggled: boolean = false;
  isEditing: boolean = false;
  @ViewChild('dynamicTable') dynamicTable!: any;

  constructor(
    private storage: LocalStorageService,
    private elementRef: ElementRef,
    private dialogService: DialogService
  ) {}

  protected toggleEditMode(data: any) {
    if (this.onEditData) {
      data.isEditMode = !data.isEditMode;
      this.isEditing = data.isEditMode;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      for (let i = 0; i < this.headerNames.length; i++)
        this.headers[i] = {
          name: this.headerNames[i],
          value: this.getHeaders()[i],
        };
      this.getColumnsOrderFromLocalStorage();
      this.getColumnsWidthsFromLocalStorage();
    }
  }

  editAction(data: any) {
    if (this.onEditData) {
      this.onEditData(data);
      data.isEditMode = false;
      this.isEditing = false;
    }
  }

  deleteAction(data: any) {
    if (this.onDeleteData) this.onDeleteData(data);
    data.isEditMode = false;
  }

  protected onColumnResizeEnd(event: MouseEvent, header: any): void {
    event.preventDefault();
    const thElement = event.target as HTMLElement;
    this.storage.set(
      `table_${this.tableId}_${header.name}_columnWidth`,
      thElement.offsetWidth
    );
  }

  protected onColumnSwapEnd(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.headers, event.previousIndex, event.currentIndex);
    this.storage.set(`table_${this.tableId}_columns`, this.headers);
  }

  protected toggleActions(): void {
    this.isActionsToggled = !this.isActionsToggled;
  }

  getWidth(): number {
    return this.elementRef.nativeElement.clientWidth;
  }

  getMinWidth(): number {
    const computedStyles = getComputedStyle(this.dynamicTable.nativeElement);
    const minWidth = computedStyles.getPropertyValue('min-width');
    return parseInt(minWidth, 10);
  }

  getBoundingClientRect(): any {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }

  private getHeaders(): string[] {
    if (this.data.length === 0) return [];
    const propertyNames = Object.getOwnPropertyNames(this.data[0]);
    return propertyNames;
  }

  private getColumnsOrderFromLocalStorage() {
    const storedColumns = this.storage.get(`table_${this.tableId}_columns`);
    if (storedColumns) this.headers = storedColumns;
  }

  private getColumnsWidthsFromLocalStorage(): void {
    for (let i = 0; i < this.headers.length; i++) {
      const storedWidth = this.storage.get(
        `table_${this.tableId}_${this.headers[i].name}_columnWidth`
      );
      if (storedWidth) {
        requestAnimationFrame(() => {
          const thElements =
            this.dynamicTable.nativeElement.querySelectorAll('th');
          thElements[i].style.width = `${storedWidth}px`;
        });
      }
    }
  }

  onDataStartTransfer(event: CdkDragExit<any>) {
    this.dialogService
      .openNotificationDialog(
        "You're moving data around! Don't worry, we'll make sure to save all the changes on the server for you."
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (this.onTransferData) this.onTransferData(event.item.data);
        }
      });
  }

  onDataTransferred(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.data,
        event.previousIndex,
        event.currentIndex
      );
      if (this.onCreateData) this.onCreateData(event.item.data);
    }
  }
}
