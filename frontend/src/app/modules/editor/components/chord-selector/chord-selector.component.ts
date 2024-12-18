import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';

import { Subscription } from 'rxjs';

import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-chord-selector',
  imports: [CommonModule, MatGridListModule, MatInputModule, MatDividerModule, MatButtonModule],
  templateUrl: './chord-selector.component.html',
  styleUrl: './chord-selector.component.scss',
})
export class ChordSelectorComponent implements OnInit, OnDestroy {
  protected chords: string[] = [];
  private chordsSubscription: Subscription | undefined;

  constructor(private readonly cdr: ChangeDetectorRef, private readonly editorService: EditorService) {}

  ngOnDestroy(): void {
    this.chordsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.chordsSubscription = this.editorService.chords$.subscribe((chords) => {
      this.chords = chords;
      this.cdr.detectChanges();
    });
  }

  insertChord(chord: string): void {
    this.editorService.insertChord(chord);
  }
}
