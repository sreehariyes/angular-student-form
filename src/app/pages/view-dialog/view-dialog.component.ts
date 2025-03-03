import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.css']
})
export class ViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Dialog Data:', data); // Log the data to verify
  }
}