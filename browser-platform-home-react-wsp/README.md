# io.Connect Home App Template

This is a React template for building an io.Connect [Home App](https://docs.interop.io/browser/capabilities/home-app/overview/index.html) that's also a [Workspace App](https://docs.interop.io/browser/capabilities/windows/workspaces/enabling-workspaces/index.html#main_app-using_the_main_app_as_a_workspaces_app). The template is configured as a fully-featured Progressive Web App (PWA).

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

To start the Home App, execute the following command:

```cmd
npm start
```

By default, the Home App will be hosted at `http://localhost:4242`. You can change the port from the `.env` file in the root directory of the project. You can now start modifying the template to build your custom Home App.

## Template Structure

The created template contains standard package files and the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/public` | Contains all files necessary for a PWA - the main `index.html` file of the app, a favicon, logos, a `manifest.json` file, a Service Worker, and the [`@interopio/browser-worker`](https://www.npmjs.com/package/@interopio/browser-worker) library scripts necessary for the Service Worker. Use the files in this directory to modify the configuration for your PWA. The [Service Worker configuration](https://docs.interop.io/browser/capabilities/notifications/setup/index.html#ioconnect_browser_worker) is necessary when using [notifications with actions](https://docs.interop.io/browser/capabilities/notifications/setup/index.html#configuration-notifications_with_actions). |
| `/src` | Contains standard React app files and additional source files for the Home App template. |
| `.env` | Contains React environment variables for the localhost port at which to start the Home App and the necessary authentication details if using [Auth0 authentication](https://docs.interop.io/browser/capabilities/home-app/library-features/index.html#using_the_components-authentication-auth0_login). |

In addition to the standard files for a React app, the `/src` directory contains the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/common` | Contains a function passed to the `config` prop of the [`<IOConnectHome />`](https://docs.interop.io/browser/capabilities/home-app/library-features/index.html#using_the_components-home_component) component. Used for retrieving the configuration for [initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#initialization-react). |
| `/main` | Contains two main components for creating a Home App - `<Auth0Main />` and `<NoAuthMain />`. By default, the app uses the `<Auth0Main />` component for [Auth0 authentication](https://docs.interop.io/browser/capabilities/home-app/library-features/index.html#using_the_components-authentication-auth0_login). To remove the authentication procedure, use the `<NoAuthMain />` component instead. |
| `config.example.json` | Example [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration). |
| `config.json` | Contains the actual configuration that will be used for initializing the Main app. You must provide a valid license key. Use this file to customize the configuration for the Main app. |

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

To modify the [`<IOConnectHome />`](https://docs.interop.io/browser/capabilities/home-app/library-features/index.html#using_the_components-home_component) component, use the `<Auth0Main />` or `<NoAuthMain />` components in the `/src/main` directory:

```javascript
import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "../common/getIOConfig";
import MyCustomUserPanel from "../MyCustomUserPanel";

export const NoAuthMain = () => {
    const ioConnectHomeConfig: IOConnectHomeConfig = {
        getIOConnectConfig: getIOConfig,
        // Customizing the Launchpad.
        launchpad: {
            components: {
                // Removing the Notification Panel.
                NotificationsPanel: null,
                // Providing a custom User Panel.
                UserPanel: MyCustomUserPanel
            }
        }
    };

    return <IOConnectHome config={ioConnectHomeConfig} />
};
```