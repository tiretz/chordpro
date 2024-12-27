import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BpmCounterComponent } from './components/bpm-counter/bpm-counter.component';
import { ChordSelectorComponent } from './components/chord-selector/chord-selector.component';
import { InlineSelectorComponent } from './components/inline-selector/inline-selector.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { PreviewDialogComponent } from './components/preview-dialog/preview-dialog.component';
import { SectionSelectorComponent } from './components/section-selector/section-selector.component';

import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-editor',
  imports: [CommonModule, MatSidenavModule, MatDividerModule, MatButtonModule, MatIconModule, MatTooltipModule, MonacoEditorComponent, ChordSelectorComponent, InlineSelectorComponent, SectionSelectorComponent, BpmCounterComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  private readonly dialog = inject(MatDialog);
  private readonly editorService = inject(EditorService);

  protected onEditorContainerResize(): void {
    // Resize editor
    const editors = (<any>window).monaco.editor.getEditors();

    if (editors && editors.length > 0) {
      editors[0].layout();
    }
  }

  protected showPreview(): void {
    this.dialog.open(PreviewDialogComponent, {
      data: {
        htmlPreview: this.editorService.monacoEditor.getValue(),
      },
    });
  }
}
