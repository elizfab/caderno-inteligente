import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/interceptors/api-error-interceptor';

import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideAppIcons } from './shared/icons/icon.registry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // authInterceptor primeiro (anexa o token), apiErrorInterceptor depois
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, apiErrorInterceptor])),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAppIcons(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
  ],
};
