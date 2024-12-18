import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

import { EditorService } from '../../services/editor.service';

export enum InlineType {
  SquareBrackets = '[]',
  CurlyBrackets = '{}',
}

@Component({
  selector: 'app-inline-selector',
  imports: [CommonModule, MatGridListModule, MatDividerModule, MatButtonModule],
  templateUrl: './inline-selector.component.html',
  styleUrl: './inline-selector.component.scss',
})
export class InlineSelectorComponent {
  protected inlines: InlineType[] = [InlineType.SquareBrackets, InlineType.CurlyBrackets];

  constructor(private readonly editorService: EditorService) {}

  insertInline(inline: string): void {
    const selectedText = this.editorService.monacoEditor.getModel().getValueInRange(this.editorService.monacoEditor.getSelection());

    let textToInsert = '';

    switch (inline) {
      case InlineType.SquareBrackets:
        textToInsert = `[${selectedText}]`;
        break;

      case InlineType.CurlyBrackets:
        textToInsert = `{${selectedText}}`;
        break;

      default:
        break;
    }

    this.editorService.monacoEditor.executeEdits('insert-preselected-text-with-inline', [
      {
        range: this.editorService.monacoEditor.getSelection(),
        text: textToInsert,
        forceMoveMarkers: true,
      },
    ]);

    this.editorService.monacoEditor.focus();
  }
}
