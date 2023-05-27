import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  snackbar = inject(MatSnackBar);

  success(message: string) {
    this.snackbar.open(message, 'Close', { duration: 10000 });
  }

  error(message: string) {
    this.snackbar.open(message, 'Close', { duration: 10000 });
  }
}
