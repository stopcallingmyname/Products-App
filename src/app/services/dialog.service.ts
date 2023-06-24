import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../widgets/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatNotificationDialogComponent } from '../widgets/mat-notification-dialog/mat-notification-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(msg: string) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }

  openNotificationDialog(msg: string) {
    return this.dialog.open(MatNotificationDialogComponent, {
      width: '390px',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
