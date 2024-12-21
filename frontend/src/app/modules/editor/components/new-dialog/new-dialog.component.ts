import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatListOption, MatSelectionListChange } from '@angular/material/list';

import { ISearchTrack } from '../../../../core/models/search-track.interface';
import { ApiService } from '../../../../core/services/api.service';

import { requireTitleOrArtists } from '../../../../shared/validators/require-title-or-artists.validator';

import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-new-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatListModule, MatGridListModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './new-dialog.component.html',
  styleUrl: './new-dialog.component.scss',
})
export class NewDialogComponent {
  protected formGroup: FormGroup;
  protected searchResults: ISearchTrack[] = [];
  protected selectedSearchTrack: ISearchTrack | undefined;

  constructor(private readonly dialogRef: MatDialogRef<NewDialogComponent>, private readonly formBuilder: FormBuilder, private readonly editorService: EditorService, private readonly apiService: ApiService) {
    this.formGroup = this.formBuilder.group(
      {
        title: [''],
        artists: [''],
      },
      {
        validators: [requireTitleOrArtists],
      }
    );
  }

  protected async onInsertTrackTemplateButtonClick(): Promise<void> {
    if (!this.selectedSearchTrack) {
      return;
    }

    this.dialogRef.close(this.selectedSearchTrack.id);
  }

  protected onSongSelected(event: MatSelectionListChange, selectedSongs: MatListOption[]) {
    if (selectedSongs.length <= 0) {
      return;
    }

    this.selectedSearchTrack = selectedSongs[0].value;
  }

  protected async searchTracks(): Promise<void> {
    if (this.formGroup.get('title')?.invalid && this.formGroup.get('artists')?.invalid) {
      return;
    }

    this.apiService.searchTracks(this.formGroup.get('title')?.value, this.formGroup.get('artists')?.value).subscribe({
      next: (searchTracks: ISearchTrack[]) => {
        this.searchResults = searchTracks;
      },
    });
  }
}
