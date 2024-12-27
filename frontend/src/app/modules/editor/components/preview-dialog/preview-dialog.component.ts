import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { ChordProParser, HtmlFormatter, HtmlTableFormatter, Song } from 'chordsheetjs';

@Component({
  selector: 'app-preview-dialog',
  imports: [MatDialogModule, MatButtonModule, MatDividerModule],
  templateUrl: './preview-dialog.component.html',
  styleUrl: './preview-dialog.component.scss',
})
export class PreviewDialogComponent implements OnInit {
  private chordProParser?: ChordProParser;
  private readonly data = inject(MAT_DIALOG_DATA);
  private htmlFormatter?: HtmlFormatter;
  protected htmlPreview?: SafeHtml;
  protected trackArtists?: string | null;
  protected trackTitle?: string | null;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.chordProParser = new ChordProParser();
    this.htmlFormatter = new HtmlTableFormatter({ evaluate: true, expandChorusDirective: true, normalizeChords: false });
  }

  ngOnInit(): void {
    if (!this.data.htmlPreview) {
      this.reset();
      return;
    }

    const song: Song | undefined = this.chordProParser?.parse(this.data.htmlPreview);

    if (!song) {
      this.reset();
      return;
    }

    this.trackTitle = song.title;
    this.trackArtists = Array.isArray(song.artist) ? song.artist.join(', ') : song.artist;

    const songAsHtml: string | undefined = this.htmlFormatter?.format(song);

    if (!songAsHtml) {
      this.reset();
      return;
    }

    this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(songAsHtml);
    // console.log(this.htmlFormatter!.cssString());
  }

  private reset(): void {
    this.htmlPreview = undefined;
    this.trackArtists = undefined;
    this.trackTitle = undefined;
  }
}
