import { Component } from '@angular/core';

import { MainComponent } from './modules/main/main.component';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Chordpro - Editor';
}
