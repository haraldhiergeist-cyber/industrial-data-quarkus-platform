import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  APP_INITIALIZER,
  provideZonelessChangeDetection,
  importProvidersFrom
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling
} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

import { AuthService } from './app/core/auth/auth.service';
import { initializeAuth } from './app/core/auth/auth.initializer';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { ApiModule } from './app/api/api.module';
import { Configuration } from './app/api/configuration';
import { environment } from './environments/environment';
import { TranslationService } from './app/core/i18n/translation.service';

function initializeTranslations(translationService: TranslationService) {
  return () =>
    translationService.init().catch(err => {
      console.error('i18n init failed (ignored):', err);
      return Promise.resolve();
    });
}

export function apiConfigFactory(): Configuration {
  return new Configuration({
    basePath: environment.apiBasePath
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),

    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeTranslations,
      deps: [TranslationService]
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeAuth,
      deps: [AuthService]
    },
   provideZonelessChangeDetection(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),

    importProvidersFrom(ApiModule.forRoot(apiConfigFactory))
  ]
};