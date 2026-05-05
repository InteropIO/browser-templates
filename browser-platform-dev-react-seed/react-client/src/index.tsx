import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOBrowser from "@interopio/browser";
import IOWorkspaces from "@interopio/workspaces-api";
import IOModals from "@interopio/modals-api";

const settings = {
    browser: {
        config: {
            libraries: [IOWorkspaces, IOModals],
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
        factory: IOBrowser
    }
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <IOConnectProvider settings={settings}>
            <App />
        </IOConnectProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
