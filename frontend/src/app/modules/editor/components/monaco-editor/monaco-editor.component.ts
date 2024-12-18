import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-monaco-editor',
  imports: [CommonModule, MonacoEditorModule],
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.scss',
})
export class MonacoEditorComponent {
  options: any = {};

  constructor(private readonly editorService: EditorService) {}

  protected onDropAreaDragOver(event: DragEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  protected async onDropAreaDrop(event: DragEvent): Promise<void> {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files.length > 0 && event.dataTransfer.files[0].name.toLowerCase().endsWith('.chopro')) {
      const file = event.dataTransfer.files[0];
      this.editorService.monacoEditor.setValue(await file.text());
    }
  }

  protected onMonacoEditorInit(editor: any): void {
    this.editorService.init(editor);
  }
}
