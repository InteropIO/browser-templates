# io.Connect Browser Platform Template

This is a React template for building an io.Connect [Browser Platform](https://docs.interop.io/browser/developers/browser-platform/overview/index.html) app (Main app) that's also a [Workspace App](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-app/index.html).

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

By default, the Main app will be hosted at `http://localhost:3000`. You can change the port from the `vite.config.ts` file in the root directory of the project. You can now start modifying the template to build your custom Main app for **io.Connect Browser**.

## Template Structure

The created template contains standard package files and the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/public` | Contains a Service Worker and the [`@interopio/browser-worker`](https://www.npmjs.com/package/@interopio/browser-worker) library scripts necessary for the Service Worker. The [Service Worker configuration](https://docs.interop.io/browser/capabilities/notifications/setup/index.html#ioconnect_browser_worker) is necessary when using [notifications with actions](https://docs.interop.io/browser/capabilities/notifications/setup/index.html#configuration-notifications_with_actions). |
| `/src` | Contains standard React app files and configuration files for the Main app. |
| `vite.config.ts` | Configuration file from which you can change the port at which the Main app is hosted. |

In addition to the standard files for a React app, the `/src` directory contains the following directories and files:

| Directory/File | Description |
|----------------|-------------|
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

To modify the Main app UI and functionalities, use the `App.tsx` file in the `/src` directory:

```javascript
import Workspaces, { Logo } from "@interopio/workspaces-ui-react";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import MyCustomToolbar from "./MyCustomToolbar";
import MyCustomButton from "./MyCustomButton";

const App = () => {
    return (
        <>
            <MyCustomToolbar />
            <Workspaces
                components={{
                    header: {
                        LogoComponent: () => <> <MyCustomButton /> <Logo /> </>
                    }
                }}
            />
        </>
    );
};

export default App;
```
