import { AuthService } from './auth.service';

export function initializeAuth(authService: AuthService) {
  return () => authService.init();
}