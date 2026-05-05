import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIoConnect } from '@interopio/ng';

import { routes } from './app.routes';
import { IOConnectService } from './io-connect.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIoConnect({
      browser: {}
    }),
    IOConnectService
  ]
};
