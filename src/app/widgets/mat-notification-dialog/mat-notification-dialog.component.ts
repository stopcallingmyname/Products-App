import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-notification-dialog',
  templateUrl: './mat-notification-dialog.component.html',
  styleUrls: ['./mat-notification-dialog.component.scss'],
})
export class MatNotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MatNotificationDialogComponent>
  ) {}
}
