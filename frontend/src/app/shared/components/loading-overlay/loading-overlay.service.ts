import { Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadingOverlayComponent } from './loading-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  private overlayRef: MatDialogRef<LoadingOverlayComponent> | undefined;

  constructor(private readonly dialog: MatDialog) {}

  show(message?: string): void {
    this.overlayRef = this.dialog.open(LoadingOverlayComponent, {
      disableClose: true,
      hasBackdrop: true,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '250ms',
      panelClass: 'loading-overlay-container',
    });

    if (!message) {
      return;
    }

    this.overlayRef.componentInstance.message = message;
  }

  updateMessage(message: string): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.componentInstance.message = message;
  }

  hide(): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.componentInstance.message = '';
    this.overlayRef.close();
  }
}
