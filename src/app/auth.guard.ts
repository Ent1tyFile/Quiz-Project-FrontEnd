import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!inject(AuthService).getUser().getValue();
  if (!isLoggedIn) {
    inject(Router).navigateByUrl('/');
  }
  return isLoggedIn;
};
