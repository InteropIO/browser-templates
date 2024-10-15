# io.Connect Browser Client Template

This is a JavaScript template for building an io.Connect [Browser Client](https://docs.interop.io/browser/developers/browser-client/overview/index.html) app.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

To start the Browser Client app, execute the following command:

```cmd
npm start
```

By default, the Browser Client app will be hosted at `http://localhost:4243`. You can change the port from the `"start"` script in the `package.json` file in the root directory of the project. You can now start modifying the template to build your custom Browser Client app.

## Template Structure

The source code of the template is located in the `/public` directory which contains the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/libs` | Contains the [`@interopio/browser`](https://www.npmjs.com/package/@interopio/browser) library scripts. |
| `index.html` | The main HTML file of the app. |
| `index.js` | The main script file of the app. |

## Modifying the Template

To modify the Browser Client app UI and functionalities, use the `index.html` and `index.js` files in the `/public` directory:

```javascript
// In `index.js`.
import IOBrowser from "./libs/browser.es.js";

const io = await IOBrowser();

await io.channels.join("Red");
```