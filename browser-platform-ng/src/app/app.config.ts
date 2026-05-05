import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IOConnectNgSettings, provideIoConnect } from '@interopio/ng';

import { routes } from './app.routes';
import * as platformConfig from '../config.json';
import { IOConnectService } from './io-connect.service';

const browserPlatformConfig =
  platformConfig as NonNullable<NonNullable<IOConnectNgSettings['browserPlatform']>['config']>;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIoConnect({
      browserPlatform: {
        config: browserPlatformConfig
      }
    }),
    IOConnectService
  ]
};
