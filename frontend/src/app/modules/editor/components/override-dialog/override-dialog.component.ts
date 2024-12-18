import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-override-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './override-dialog.component.html',
  styleUrl: './override-dialog.component.scss',
})
export class OverrideDialogComponent {
  title: string;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: OverrideDialogModel) {
    this.title = data.title;
    this.message = data.message;
  }
}

export class OverrideDialogModel {
  constructor(public title: string, public message: string) {}
}
