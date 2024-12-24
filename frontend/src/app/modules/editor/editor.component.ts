import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';

import { BpmCounterComponent } from './components/bpm-counter/bpm-counter.component';
import { ChordSelectorComponent } from './components/chord-selector/chord-selector.component';
import { InlineSelectorComponent } from './components/inline-selector/inline-selector.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { SectionSelectorComponent } from './components/section-selector/section-selector.component';

@Component({
  selector: 'app-editor',
  imports: [CommonModule, MatSidenavModule, MonacoEditorComponent, ChordSelectorComponent, InlineSelectorComponent, SectionSelectorComponent, BpmCounterComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  protected onEditorContainerResize(): void {
    // Resize editor
    const editors = (<any>window).monaco.editor.getEditors();

    if (editors && editors.length > 0) {
      editors[0].layout();
    }
  }
}
