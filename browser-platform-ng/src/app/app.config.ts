import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIoConnect } from "@interopio/ng";
import IOBrowserPlatform from "@interopio/browser-platform";

import { routes } from './app.routes';
import * as platformConfig from '../config.json';
import { IOConnectService } from './io-connect.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIoConnect({
      browserPlatform: {
        factory: IOBrowserPlatform,
        config: platformConfig
      }
    }),
    IOConnectService
  ]
};
