import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IOConnectProvider } from "@interopio/react-hooks";
import IODesktop, { IOConnectDesktop } from "@interopio/desktop";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import IOWorkspaces from "@interopio/workspaces-api";
import IOModals from '@interopio/modals-api';
import config from "./config.json";

const browserPlatformConfig = {
    ...config.browserPlatform,
    browser: {
        libraries: [IOWorkspaces, IOModals],
        serviceWorker: { url: "/service-worker.js" },
        modals: {
            alerts: {
                enabled: true,
            },
            dialogs: {
                enabled: true,
            }
        },
        intentResolver: {
            enable: true
        }
    },
}

const settings = {
    browserPlatform: {
        config: browserPlatformConfig as IOConnectBrowserPlatform.Config,
        factory: IOBrowserPlatform
    },
    desktop: {
        config: { libraries: [IOWorkspaces], appManager: "skipIcons" as IOConnectDesktop.AppManager.Mode },
        factory: IODesktop
    }
};

const container = document.getElementById("root") as HTMLElement;;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <IOConnectProvider settings={settings}>
            <App />
        </IOConnectProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
