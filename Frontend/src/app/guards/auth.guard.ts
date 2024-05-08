import { AuthService } from './../services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
//import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn) {
    return router.createUrlTree(['/login']);
  } else {
    return true;
  }
};