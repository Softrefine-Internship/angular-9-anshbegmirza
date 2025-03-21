import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('userData') ? true : false;
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

// the can activate function had this error :the declaration was marked as deprecated here

// to resolve it I used functional routes, instead.
