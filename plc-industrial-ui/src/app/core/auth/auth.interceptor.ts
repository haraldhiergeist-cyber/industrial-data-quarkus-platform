import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const PUBLIC_API_PATH_PREFIXES = [
  '/api/plc',
  '/api/history'
];

function extractPathname(url: string): string {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).pathname.toLowerCase();
    }

    return url.toLowerCase().split('?')[0];
  } catch {
    return url.toLowerCase().split('?')[0];
  }
}

function isPublicApiEndpoint(url: string): boolean {
  const pathname = extractPathname(url);

  return PUBLIC_API_PATH_PREFIXES.some(prefix =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const apiBasePath = environment.apiBasePath;
  const isRelativeApiCall = req.url.startsWith('/api');
  const isConfiguredApiCall = apiBasePath ? req.url.startsWith(apiBasePath) : false;

  if (!isRelativeApiCall && !isConfiguredApiCall) {
    return next(req);
  }

  if (isPublicApiEndpoint(req.url)) {
    return next(req);
  }

  return from(authService.getToken()).pipe(
    switchMap(token => {
      if (!token) {
        return next(req);
      }

      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      );
    })
  );
};