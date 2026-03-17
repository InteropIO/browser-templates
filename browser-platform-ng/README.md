# io.Connect Browser Platform Template

This is an Angular template for building an io.Connect [Browser Platform](https://docs.interop.io/browser/developers/browser-platform/overview/index.html) app - the Main app in an **io.Connect Browser** project.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

Go to the `config.json` file in the `/src` directory and provide your valid license key for using the **io.Connect Browser** platform:

```json
{
    "licenseKey": "my-license-key"
}
```

To start the Main app, execute the following command:

```cmd
npm start
```

By default, the Main app will be hosted at `http://localhost:4200`. You can change the port in the `angular.json` file by adding or modifying the `projects.browser-platform-ng.architect.serve.options.port` setting. You can now start modifying the template to build your custom Main app for **io.Connect Browser**.

## Template Structure

The created template contains standard Angular package files and the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/public` | Contains static assets for the app. |
| `/src` | Contains the Angular app source files, including the main `main.ts` entry point, the root app component files, and the `io-connect.service.ts` file for accessing the initialized [`@interopio/browser-platform`](https://www.npmjs.com/package/@interopio/browser-platform) instance. |
| `src/config.example.json` | Example [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration). |
| `src/config.json` | Contains the actual configuration that will be used for initializing the Main app. You must provide a valid license key. Use this file to customize the configuration for the Main app. |
| `src/index.html` | The main HTML template file of the app. |

## Modifying the Template

To modify the [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration), use the `config.json` file in the `/src` directory. There you can define apps, Layouts, Channels, and more:

```json
{
    "licenseKey": "my-license-key",
    "applications": {
        "local": [
            {
                "name": "my-app",
                "type": "window",
                "title": "My App",
                "details": {
                    "url": "https://my-domain.com/my-app"
                }
            }
        ]
    }
}
```

To modify the Main app UI and functionalities, use the root component and Angular service files in the `/src/app` directory:

```typescript
// In `app.ts`.
import { Component, inject, OnInit, signal } from '@angular/core';
import { IOConnectService } from './io-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html'
})
export class App implements OnInit {
  private readonly ioConnectService = inject(IOConnectService);

  public ioConnectStatus = signal<'connected' | 'disconnected'>('disconnected');

  ngOnInit(): void {
    this.ioConnectStatus.set(this.ioConnectService.connectionStatus);
  }

  platformVersion(): string {
    return this.ioConnectService.io.webPlatform?.version || 'N/A';
  }
}
```
