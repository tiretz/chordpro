import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chords-over-text-import-dialog',
  imports: [MatDialogModule, MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './chords-over-text-import-dialog.component.html',
  styleUrl: './chords-over-text-import-dialog.component.scss',
})
export class ChordsOverTextImportDialogComponent {}
