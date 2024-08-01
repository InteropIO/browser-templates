import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { IOConnectProvider } from '@interopio/react-hooks'
import IOWorkspaces from "@interopio/workspaces-api";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import config from "./config.json";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IOConnectProvider settings={{
      browserPlatform: {
        config: Object.assign({}, config.browserPlatform, { browser: { libraries: [IOWorkspaces] }, serviceWorker: { url: "/service-worker.js" } }) as IOConnectBrowserPlatform.Config,
        factory: IOBrowserPlatform
      }
    }}>
      <App />
    </IOConnectProvider>
  </React.StrictMode>,
)
