import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOWorkspaces from "@interopio/workspaces-api";
import IOModals from "@interopio/modals-api";
import IOBrowserPlatform from "@interopio/browser-platform";
import config from "./config.json";

const settings = {
    browserPlatform: {
        config: {
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
                    },
                },
                intentResolver: {
                    enable: true,
                },
            },
        },
        factory: IOBrowserPlatform,
    },
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <IOConnectProvider settings={settings}>
            <App />
        </IOConnectProvider>
    </React.StrictMode>
);
