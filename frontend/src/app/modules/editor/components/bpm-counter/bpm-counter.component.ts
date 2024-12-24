import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BpmService } from '../../services/bpm.service';

@Component({
  selector: 'app-bpm-counter',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './bpm-counter.component.html',
  styleUrl: './bpm-counter.component.scss',
})
export class BpmCounterComponent {
  constructor(protected readonly bpmServerice: BpmService) {}

  protected onReset(): void {
    this.bpmServerice.reset();
  }

  protected onTab(): void {
    this.bpmServerice.tap();
  }
}
