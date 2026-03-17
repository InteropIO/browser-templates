# io.Connect Browser Client Template

This is an Angular template for building an io.Connect [Browser Client](https://docs.interop.io/browser/developers/browser-client/overview/index.html) app.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

To start the Browser Client app, execute the following command:

```cmd
npm start
```

By default, the Browser Client app will be hosted at `http://localhost:4201`. You can change the port in the `angular.json` file by modifying the `projects.browser-client-ng.architect.serve.options.port` setting. You can now start modifying the template to build your custom Browser Client app.

## Template Structure

The created template contains standard Angular package files and the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/public` | Contains static assets for the app. |
| `/src` | Contains the Angular app source files, including the main `main.ts` entry point, the root app component files, and the `io-connect.service.ts` file for accessing the initialized [`@interopio/browser`](https://www.npmjs.com/package/@interopio/browser) instance. |
| `src/index.html` | The main HTML template file of the app. |

## Modifying the Template

To modify the Browser Client app UI and functionalities, use the root component and the Angular service files in the `/src/app` directory:

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

  apiVersion(): string {
    return this.ioConnectService.io.version || 'N/A';
  }
}
```
