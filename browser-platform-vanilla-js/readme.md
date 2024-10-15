# io.Connect Browser Platform Template

This is a JavaScript template for building an io.Connect [Browser Platform](https://docs.interop.io/browser/developers/browser-platform/overview/index.html) app - the Main app in an **io.Connect Browser** project.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

Go to the `config.json` file in the `/public` directory and provide your valid license key for using the **io.Connect Browser** platform:

```json
{
    "licenseKey": "my-license-key"
}
```

To start the Main app, execute the following command:

```cmd
npm start
```

By default, the Main app will be hosted at `http://localhost:4242`. You can change the port from the `"start"` script in the `package.json` file in the root directory of the project. You can now start modifying the template to build your custom Main app for **io.Connect Browser**.

## Template Structure

The created template contains standard package files and a `/public` directory with the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/libs` | Contains the [`@interopio/browser-platform`](https://www.npmjs.com/package/@interopio/browser-platform) library scripts. |
| `config.example.json` | Example [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration). |
| `config.json` | Contains the actual configuration that will be used for initializing the Main app. You must provide a valid license key. Use this file to customize the configuration for the Main app. |
| `index.html` | The main HTML file of the app. |
| `index.js` | The main script file of the app. |

## Modifying the Template

To modify the [configuration for initializing the Main app](https://docs.interop.io/browser/developers/browser-platform/setup/index.html#configuration), use the `config.json` file in the `/public` directory. There you can define apps, Layouts, Channels, and more:

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

To modify the Main app UI and functionalities, use the `index.html` and `index.js` files in the `/public` directory:

```javascript
// In index.js.
import IOBrowserPlatform from "./libs/browser.platform.es.js";
import config from "./config.json";

const { io } = await IOBrowserPlatform(config);

const myButton = document.getElementById("my-button");

myButton.onclick = () => io.appManager.application("my-app").start();
```