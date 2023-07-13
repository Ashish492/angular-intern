import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../module/auth/services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  let _authService = inject(AuthService);
  let _router = inject(Router);
  if (!_authService.isLogin()) {
    _router.navigate(['/']);
  }
  return true;
};
