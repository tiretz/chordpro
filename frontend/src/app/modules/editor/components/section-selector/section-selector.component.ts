import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

import { EditorService } from '../../services/editor.service';

export enum SectionType {
  Bridge = 'Bridge',
  Chorus = 'Chorus',
  Comment = 'Comment',
  Instrumental = 'Instrumental',
  Intro = 'Intro',
  Outro = 'Outro',
  Post_Chorus = 'Post-Chorus',
  Pre_Chorus = 'Pre-Chorus',
  Solo = 'Solo',
  Tab = 'Tab',
  Verse_1 = 'Verse 1',
  Verse_2 = 'Verse 2',
  Verse_3 = 'Verse 3',
  Verse_4 = 'Verse 4',
  Verse_5 = 'Verse 5',
}

@Component({
  selector: 'app-section-selector',
  imports: [CommonModule, MatGridListModule, MatDividerModule, MatButtonModule],
  templateUrl: './section-selector.component.html',
  styleUrl: './section-selector.component.scss',
})
export class SectionSelectorComponent {
  protected sections: SectionType[] = [
    SectionType.Intro,
    SectionType.Verse_1,
    SectionType.Chorus,
    SectionType.Verse_2,
    SectionType.Bridge,
    SectionType.Verse_3,
    SectionType.Pre_Chorus,
    SectionType.Verse_4,
    SectionType.Post_Chorus,
    SectionType.Verse_5,
    SectionType.Instrumental,
    SectionType.Solo,
    SectionType.Outro,
    SectionType.Comment,
    SectionType.Tab,
  ];

  constructor(private readonly editorService: EditorService) {}

  insertSection(section: string) {
    const selectedText = this.editorService.monacoEditor.getModel().getValueInRange(this.editorService.monacoEditor.getSelection());

    let snippet = '';

    switch (section) {
      case SectionType.Intro:
        snippet = 'intro';
        break;

      case SectionType.Pre_Chorus:
        snippet = 'pre_chorus';
        break;

      case SectionType.Chorus:
        snippet = 'chorus';
        break;

      case SectionType.Post_Chorus:
        snippet = 'post_chorus';
        break;

      case SectionType.Verse_1:
        snippet = 'verse_1';
        break;

      case SectionType.Verse_2:
        snippet = 'verse_2';
        break;

      case SectionType.Verse_3:
        snippet = 'verse_3';
        break;

      case SectionType.Verse_4:
        snippet = 'verse_4';
        break;

      case SectionType.Verse_5:
        snippet = 'verse_5';
        break;

      case SectionType.Bridge:
        snippet = 'bridge';
        break;

      case SectionType.Instrumental:
        snippet = 'instrumental';
        break;

      case SectionType.Solo:
        snippet = 'solo';
        break;

      case SectionType.Outro:
        snippet = 'outro';
        break;

      case SectionType.Comment:
        snippet = 'comment';
        break;

      case SectionType.Tab:
        snippet = 'tab';
        break;

      default:
        break;
    }

    this.editorService.monacoEditor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    this.editorService.monacoEditor.trigger('keyboard', 'type', { text: snippet });

    setTimeout(() => {
      this.editorService.monacoEditor.trigger('editor', 'acceptSelectedSuggestion', {});
      this.editorService.monacoEditor.executeEdits('insert-preselected-text', [
        {
          range: this.editorService.monacoEditor.getSelection(),
          text: selectedText,
          forceMoveMarkers: true,
        },
      ]);
      this.editorService.monacoEditor.focus();
    }, 100);
  }
}
