# io.Connect Browser Client Template

This is a React template (created with Create React App) for building an io.Connect [Browser Client](https://docs.interop.io/browser/developers/browser-client/overview/index.html) app.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

To start the Browser Client app, execute the following command:

```cmd
npm start
```

By default, the Browser Client app will be hosted at `http://localhost:4244`. You can change the port from the `"start"` script in the `package.json` file in the root directory of the project, or by creating a `.env` file. You can now start modifying the template to build your custom Browser Client app.

## Template Structure

The created template contains standard package files and the following directories and files:

| Directory/File | Description |
|----------------|-------------|
| `/public` | Contains standard React app files, including the main `index.html` file of the app. |
| `/src` | Contains standard React app files, including the main `index.tsx` file of the app where the [`@interopio/browser`](https://www.npmjs.com/package/@interopio/browser) library is initialized, and the main app component in the `App.tsx`. |

## Modifying the Template

To modify the Browser Client app UI and functionalities, use the main component or your own custom components:

```javascript
// In `App.tsx`.
import { useState, useContext } from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import MyCustomComponent from "./MyCustomComponent"

const App = () => {
    const [context, setContext] = useState({});
    const io = useContext(IOConnectContext);

    useEffect(() => {
        const windowContext = await io.windows.my().getContext();

        setContext(windowContext);
    }, []);

    return (
        <div className="App">
            <MyCustomComponent />
        </div>
    );
};

export default App;
```