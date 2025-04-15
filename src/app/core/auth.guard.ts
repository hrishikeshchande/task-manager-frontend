import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    if (state.url === '/login') {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  } else {
    if (state.url !== '/login') {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }
};
