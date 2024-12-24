import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BpmService {
  private bpmSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public bpm$: Observable<number> = this.bpmSubject.asObservable();
  private INTERVAL_THRESHOLD = 1.5;
  private taps: Array<number> = [];

  private get intervalAverageInMs(): number {
    if (this.taps.length < 2) {
      return 0;
    }

    return this.intervalsInMs.reduce((total: number, amount: number, index: number, array: number[]) => {
      total += amount;
      if (index === array.length - 1) {
        return total / array.length;
      } else {
        return total;
      }
    });
  }

  private get intervalsInMs(): number[] {
    const intervals = this.taps.map((stamp, index) => {
      const nextStamp = this.taps[index + 1];
      return nextStamp - stamp;
    });

    intervals.pop(); // Last entry is null

    return intervals;
  }

  private isIntervalTooLong(tapInMs: number): boolean {
    if (this.intervalAverageInMs === 0) {
      return false;
    }

    const lastIntervalInMs = tapInMs - this.lastTapInMs;
    return lastIntervalInMs > this.intervalAverageInMs * this.INTERVAL_THRESHOLD;
  }

  private isTimeStampChronological(tapInMs: number): boolean {
    if (this.taps.length === 0) {
      return true;
    }

    return this.lastTapInMs < tapInMs;
  }

  get lastTapInMs(): number {
    if (this.taps.length < 2) {
      return 0;
    }

    return this.taps[this.taps.length - 1];
  }

  public reset(): void {
    this.taps = [];
    this.bpmSubject.next(0);
  }

  public tap(ms: number = performance.now()): void {
    if (!this.isTimeStampChronological(ms) || this.isIntervalTooLong(ms)) {
      return this.reset();
    }

    this.taps.push(ms);

    if (this.intervalAverageInMs) {
      this.bpmSubject.next(60000 / this.intervalAverageInMs);
      return;
    }

    this.bpmSubject.next(0);
  }
}
