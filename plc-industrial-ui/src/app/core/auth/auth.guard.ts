import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.authenticated()) {
    return true;
  }

  if (!(await auth.loginTo(state.url))) {
    return router.parseUrl('/auth/error');
  }

  return false;
};
