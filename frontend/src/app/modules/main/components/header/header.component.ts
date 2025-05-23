import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { firstValueFrom } from 'rxjs';

import { Song } from 'chordsheetjs';

import { ITrack } from '../../../../core/models/track.interface';
import { ApiService } from '../../../../core/services/api.service';

import { LoadingOverlayService } from '../../../../shared/components/loading-overlay/loading-overlay.service';

import { NewDialogComponent } from '../../../editor/components/new-dialog/new-dialog.component';
import { OverrideDialogComponent, OverrideDialogModel } from '../../../editor/components/override-dialog/override-dialog.component';
import { ChordsOverTextImportDialogComponent } from '../../../editor/components/chords-over-text-import-dialog/chords-over-text-import-dialog.component';
import { ChordSheetService } from '../../../editor/services/chord-sheet.service';
import { BpmService } from '../../../editor/services/bpm.service';
import { EditorService } from '../../../editor/services/editor.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly chordSheetService: ChordSheetService = inject(ChordSheetService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly editorService: EditorService = inject(EditorService);
  private readonly bpmService: BpmService = inject(BpmService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly loadingOverlayService: LoadingOverlayService = inject(LoadingOverlayService);

  private async cancelOverrideEditorValue(): Promise<boolean> {
    if (this.editorService.monacoEditor.getValue()) {
      const dialogRef = this.dialog.open(OverrideDialogComponent, {
        width: '400px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
        data: new OverrideDialogModel('Override track', 'Do you really want to override your current track?'),
      });

      const overrideResult = await firstValueFrom(dialogRef.afterClosed());

      if (!overrideResult) {
        return true;
      }
    }

    return false;
  }

  protected async onDownloadTrackButtonClick(): Promise<void> {
    await this.saveToFile(this.editorService.monacoEditor.getValue(), this.editorService.getDownloadFilename());
  }

  protected async onImportChordsOverTextButtonClick(): Promise<void> {
    if (await this.cancelOverrideEditorValue()) {
      return;
    }

    this.editorService.reset();

    const dialogRef = this.dialog.open(ChordsOverTextImportDialogComponent, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      position: { top: '5%' },
      width: '65%',
    });

    dialogRef.afterClosed().subscribe((chordsOverText: string | undefined) => {
      if (!chordsOverText) {
        return;
      }

      this.loadingOverlayService.show('Parsing track ...');

      const song: Song | undefined = this.chordSheetService.chordsOverTextParser?.parse(chordsOverText);

      if (!song) {
        this.loadingOverlayService.hide();
        return;
      }

      const formattedTrack: string | undefined = this.chordSheetService.chordProFormatter?.format(song);

      this.apiService.getTrackTemplate().subscribe({
        next: (trackTemplate: string) => {
          this.editorService.monacoEditor.setValue(trackTemplate + '\n' + formattedTrack);

          this.loadingOverlayService.hide();
        },
      });
    });
  }

  protected async onInsertEmptyTrackTemplateButtonClick(): Promise<void> {
    if (await this.cancelOverrideEditorValue()) {
      return;
    }

    this.editorService.reset();

    this.loadingOverlayService.show('Getting empty track template ...');

    this.apiService.getTrackTemplate().subscribe({
      next: (emptyTrackTemplate: string) => {
        this.editorService.monacoEditor.setValue(emptyTrackTemplate);

        this.loadingOverlayService.hide();
      },
    });
  }

  protected async onNewTrackButtonClick(): Promise<void> {
    if (await this.cancelOverrideEditorValue()) {
      return;
    }

    this.editorService.reset();

    const dialogRef = this.dialog.open(NewDialogComponent, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      position: { top: '5%' },
      width: '65%',
    });

    dialogRef.afterClosed().subscribe((trackId: string | undefined) => {
      if (!trackId) {
        return;
      }

      this.loadingOverlayService.show('Getting track template ...');

      this.apiService.getTrack(trackId).subscribe({
        next: (track: ITrack) => {
          const trackTemplate: string = track.chordproBody;

          this.editorService.monacoEditor.setValue(trackTemplate);

          this.loadingOverlayService.hide();
        },
      });
    });
  }

  private async saveToFile(data: any, filename: string): Promise<void> {
    const supportsFileSystemAccess =
      'showSaveFilePicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();

    if (supportsFileSystemAccess) {
      try {
        const handle = await showSaveFilePicker({ suggestedName: filename });

        if (!handle) return;

        const writable = await handle.createWritable();

        await writable.write(data);
        await writable.close();

        return;
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err.name, err.message);
          return;
        }

        return;
      }
    }

    const blob = new Blob([data], { type: 'text/plain' });

    const blobURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobURL;
    a.download = filename;
    a.style.display = 'none';
    document.body.append(a);

    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);
  }
}
