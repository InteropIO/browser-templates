import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx"
import { IOConnectProvider } from "@interopio/react-hooks"
import IOWorkspaces from "@interopio/workspaces-api";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import config from "./config.json";

const settings = {
    browserPlatform: {
        config: Object.assign({}, config.browserPlatform, { browser: { libraries: [IOWorkspaces] }, serviceWorker: { url: "/service-worker.js" } }) as IOConnectBrowserPlatform.Config,
        factory: IOBrowserPlatform
    }
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <IOConnectProvider settings={settings}>
            <App />
        </IOConnectProvider>
    </React.StrictMode>,
);
