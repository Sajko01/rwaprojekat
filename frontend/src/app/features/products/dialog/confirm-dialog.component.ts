import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'] 
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string, name: string, isConfirm?: boolean }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); 
  }

  onClose(): void {
    this.dialogRef.close(false); 
  }
}