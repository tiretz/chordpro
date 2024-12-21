import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { firstValueFrom } from 'rxjs';

import { ITrack } from '../../../../core/models/track.interface';
import { ApiService } from '../../../../core/services/api.service';

import { LoadingOverlayService } from '../../../../shared/components/loading-overlay/loading-overlay.service';

import { NewDialogComponent } from '../../../editor/components/new-dialog/new-dialog.component';
import { OverrideDialogComponent, OverrideDialogModel } from '../../../editor/components/override-dialog/override-dialog.component';
import { EditorService } from '../../../editor/services/editor.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private readonly dialog: MatDialog, private readonly editorService: EditorService, private readonly apiService: ApiService, private readonly loadingOverlayService: LoadingOverlayService) {}

  protected async onDownloadButtonClick(): Promise<void> {
    await this.saveToFile(this.editorService.monacoEditor.getValue(), this.editorService.getDownloadFilename());
  }

  protected async onNewButtonClick(): Promise<void> {
    if (this.editorService.monacoEditor.getValue()) {
      const dialogRef = this.dialog.open(OverrideDialogComponent, {
        width: '400px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
        data: new OverrideDialogModel('Override track', 'Do you really want to override your current track?'),
      });

      const overrideResult = await firstValueFrom(dialogRef.afterClosed());

      if (!overrideResult) {
        return;
      }
    }

    this.editorService.monacoEditor.setValue('');

    const dialogRef = this.dialog.open(NewDialogComponent, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      position: { top: '5%' },
      width: '65%',
    });

    dialogRef.afterClosed().subscribe((trackId: string) => {
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
