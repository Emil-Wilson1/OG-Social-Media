
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  if (!adminService.isLoggedIn) {
    return router.createUrlTree(['/adminLogin']);
  } else {
    return true;
  }
};