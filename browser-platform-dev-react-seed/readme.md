# io.Connect Browser Seed Project

This is a fully configured [**io.Connect Browser**](https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html) project consisting of multiple apps. It allows you to experience some of the io.Connect features without having to set up or configure a complex environment.

If you are a web developer looking to experiment with **io.Connect Browser**, build a PoC, a demo, or even eventually release into production a multi-app **io.Connect Browser** project, this setup provides the necessary foundations. Configuring the environment and initializing the libraries has already been done, enabling you to directly start building your custom project.

*For more details on **io.Connect Browser**, see the [official documentation](https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html).*

## Project Overview

The project will start at `http://localhost:3000`. The window will load an io.Connect [Workspaces App](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-app/index.html) containing a single [Workspace](https://docs.interop.io/browser/capabilities/windows/workspaces/overview/index.html#workspaces_concepts-workspace) with the following apps:

- On the left is a standard interop-enabled app built with Create React App - the ideal starting point for React developers.
- On the right is a group of three tabs - the io.Connect documentation, a [Context Viewer](https://docs.interop.io/desktop/developers/dev-tools/index.html#context_viewer) and an [Interop Viewer](https://docs.interop.io/desktop/developers/dev-tools/index.html#interop_viewer) apps. The Context Viewer and the Interop Viewer are developer tool apps from [**io.Connect Desktop**](https://interop.io/products/io-connect/) and are extremely useful when developing, testing or debugging io.Connect apps with extensive [Interop](https://docs.interop.io/browser/capabilities/data-sharing/interop/index.html) or [Shared Contexts](https://docs.interop.io/browser/capabilities/data-sharing/shared-contexts/index.html) functionalities.
- The project also contains a built [Intents Resolver App](https://docs.interop.io/browser/capabilities/intents/overview/index.html#intents_resolver). The Intents Resolver App is enabled by default for all Browser Client apps. It provides a UI for the user, allowing them to choose how to handle a raised [Intent](https://docs.interop.io/browser/capabilities/intents/overview/index.html) when there are multiple handlers available for it.

The Workspaces App acts as a [Main app](https://docs.interop.io/browser/developers/browser-platform/overview/index.html) (Browser Platform) for this project.

This is a fully unlocked and functioning project - the user is free to add new apps to the Workspace, create a new Workspace, save it, move the apps around, or even extract them into standalone windows.

React developers can immediately get started with extending the standard CRA app and use the Interop Viewer and the Context Viewer apps to monitor how their io.Connect enabled apps are registering methods and streams or manipulating contexts.

## Usage

*Note that to run this project, you must provide a valid license key for [**io.Connect Browser**](https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html). For more details, see the [Configuration > Licensing](#licensing) section.*

To launch the project, clone this repo and execute the following commands:

```cmd
npm install
npm run bootstrap
npm start
```

The `npm run bootstrap` command will install all dependencies for all apps. Each app in the project is deliberately self-sufficient so that it can be easily extracted and deployed on its own or placed in a different environment.

The `npm start` command will launch all development servers - one for each app. This will simulate more accurately a real-life environment where your [**io.Connect Browser**](https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html) project will contain many apps deployed at different origins.

## Configuration

The [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration) is located in the `config.json` file in the `/workspace-platform/src` directory. There you can define apps, Layouts, Channels, and more.

The only required configuration to be able to run the project is to provide a valid license key for **io.Connect Browser**. To obtain a license, contact the io.Connect Sales team at `licensing@interop.io`.

This project supports all available [configuration settings](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration) for initializing the Main app. The following sections describe only some of the available options.

### Licensing

To provide your license key, use the `"licenseKey"` property in the `config.json` file:

```json
{
    "browserPlatform": {
        "licenseKey": "my-license-key"
    }
}
```

If the license key is invalid or missing, the project will load a blank screen and will throw errors in the browser console describing the issue.

### Adding Apps

To add already deployed apps to the project, open the `config.json` file and add [app definitions](https://docs.interop.io/browser/capabilities/app-management/index.html#app_definitions) for them to the `"local"` array under the `"applications"` key:

```json
{
    "browserPlatform": {
        "applications": {
            "local": [
                {
                    "name": "My New App",
                    "type": "window",
                    "title": "My New App Title",
                    "details": {
                        "url": "http://my-new-app.com/"
                    },
                    "customProperties": {
                        "includeInWorkspaces": true
                    }
                }
            ]
        }
    }
}
```

The only required properties are `"name"`, `"type"`, and `"url"`. The `"type"` property must be set to `"window"`. The `"includeInWorkspaces"` property allows your app to be visible in the list of apps when the user opens the "Add Apps" menu by clicking the `+` icon in a Workspace.*

Once you add the definition, your app will become part of the **io.Connect Browser** environment and you can use the [App Management API](https://docs.interop.io/browser/capabilities/app-management/index.html) to launch it and manipulate it as a standalone window, or use the [Workspaces API](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-api/index.html) to join it to a Workspace and manipulate it as a Workspace window.

*For details on how to add new client apps by adding their source code to this project, see the [How to... > Add New Browser Clients](#add-new-browser-clients) section.*

### Connecting to io.Manager

**io.Connect Browser** can [connect to a deployed **io.Manager**](https://docs.interop.io/browser/capabilities/manager/index.html) instance. To enable connection to **io.Manager**, open the `config.json` file and add the necessary configuration details using the `"server"` key:

```json
{
    "browserPlatform": {
        "server": {
            "url": "https://my-io-manager.com:4081/api",
            "auth": {
                "basic": {
                    "username": "username",
                    "password": "password"
                }
            },
            "fetchIntervalMS": 10000,
            "tokenRefreshIntervalMS": 15000,
            "critical": true
        }
    }
}
```

*For more details on configuring a connection to **io.Manager**, see the [Capabilities > io.Manager](https://docs.interop.io/browser/capabilities/manager/index.html) documentation.*

### Connecting to io.Connect Desktop

**io.Connect Browser** projects can be configured to constantly check for the presence of a locally installed **io.Connect Desktop** project. If such an instance is discovered, the **io.Connect Browser** project will attempt to switch its io.Connect connection to **io.Connect Desktop**. If this operation is successful, the **io.Connect Browser** clients will be able to fully interoperate with all **io.Connect Desktop** clients.

To enable this functionality, go to the `config.json` file and add the necessary configuration details using the `"connection"` key:

```json
{
    "browserPlatform": {
        "connection": {
            "preferred": {
                "url": "ws://localhost:8385/gw",
                "discoveryIntervalMS": 10000
            }
        }
    }
}
```

*For more details on configuring a connection to **io.Connect Desktop**, see the [Capabilities > io.Connect Desktop](https://docs.interop.io/browser/capabilities/desktop/index.html) documentation.*

## How to...

### Extend the React Client

The `/react-client` directory contains the source code of the app which appears in the left side of the Workspace. This is the standard bootstrapped project that comes with the standard Create React App. The only addition is the initialization of the [io.Connect Browser](https://docs.interop.io/browser/reference/javascript/io.connect%20browser/index.html#overview) library, which connects this [Browser Client](https://docs.interop.io/browser/developers/browser-client/overview/index.html) to the **io.Connect Browser** environment. React developers can immediately start extending this simple app with the required business logic.

### Add New Browser Clients

The [Configuration > Adding Apps](#adding-apps) section shows how to easily add an already deployed app to the [**io.Connect Browser**](https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html) environment by providing only its URL. You can also add the source code of your app to this seed project and take advantage of the development environment that has already been set up.

To do this, create a new directory (e.g., `/my-other-app`), place the source code there and make sure that the app is completely self-sufficient: it must have its own `package.json` file, a valid `"start"` command for hosting the app, and a `"build"` command that produces a build ready for deployment.

Open the `gulpfile.js` file, locate the `clientsSources` array at the top of the file, and add to the array the path to the source code of your app:

```javascript
const clientsSources = ["workspace-platform/", "react-client/", "my-other-app/"];
```

Now, every time you execute an `npm run bootstrap` command from the base project directory, the development environment will clear the `node_modules` directory of your app, and will run a fresh `npm install` in it. Similarly, when executing an `npm start` command from the base project directory, the environment will run the `"start"` command defined in the `package.json` file of your app.

### Interop-Enable Your Apps

Every web app can be a [Browser Client](https://docs.interop.io/browser/developers/browser-client/overview/index.html) in an **io.Connect Browser** project. A Browser Client app is any web app which has initialized one of the io.Connect packages and has connected to a running[**io.Connect Browser** environment. To interop-enable your web app, you can use the following io.Connect packages which provide all available io.Connect functionalities:

- [`@interopio/browser`](https://www.npmjs.com/package/@interopio/browser) - a JavaScript package. For more details on using the package in your apps, see the [Browser Client > JavaScript](https://docs.interop.io/browser/developers/browser-client/javascript/index.html) documentation.

- [`@interopio/react-hooks`](https://www.npmjs.com/package/@interopio/react-hooks) - a React package enabling the usage of the io.Connect JavaScript APIs in React apps. For more details on using the package in your apps, see the [Browser Client > React](https://docs.interop.io/browser/developers/browser-client/react/index.html) documentation.

- [`@interopio/ng`](https://www.npmjs.com/package/@interopio/ng) - an Angular package enabling the usage of the io.Connect JavaScript APIs in Angular apps. For more details on using the package in your apps, see the [io.Connect Browser Client > Angular](https://docs.interop.io/browser/developers/browser-client/angular/index.html) documentation.

*For more examples on using the libraries and the io.Connect APIs, see the [Tutorials](https://docs.interop.io/browser/tutorials/javascript/index.html) documentation.*

### Customize the Workspaces App

The [Workspaces App](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-app/index.html) is the visual orchestrator of this seed project and is extremely customizable - from simple visual modifications using CSS to adding custom React components in it. For more details on how to do that, see the [Workspaces App](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-app/index.html) documentation.

## FAQ

### Can't Extract an App from the Workspace

Extracting an app from the Workspace involves opening this app in a standalone window as a browser popup. Every modern browser requires an explicit permission from the user to allow the given origin to open popups. If this prompt is ignored or declined, then the **io.Connect Browser** environment won't be able to open standalone windows and therefore the user won't be able to extract apps from the Workspace. Sometimes, based on previous user behavior, browsers will assume that the user doesn't allow popups by default. In this situation, you have to manually allow popups by going to the browser settings, or by clicking the icon for blocked popups in the browser address bar.