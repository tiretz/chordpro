import { Injectable } from '@angular/core';

import { ChordProFormatter, ChordProParser, HtmlFormatter, HtmlTableFormatter, UltimateGuitarParser } from 'chordsheetjs';

@Injectable({
  providedIn: 'root',
})
export class ChordSheetService {
  public chordProFormatter?: ChordProFormatter;
  public chordProParser?: ChordProParser;

  public get chordsOverTextParser(): UltimateGuitarParser {
    return new UltimateGuitarParser({ preserveWhitespace: false });
  }

  public htmlFormatter?: HtmlFormatter;

  constructor() {
    this.chordProFormatter = new ChordProFormatter({ evaluate: true, expandChorusDirective: true, normalizeChords: false });
    this.chordProParser = new ChordProParser();
    this.htmlFormatter = new HtmlTableFormatter({ evaluate: true, expandChorusDirective: true, normalizeChords: false });
  }
}
