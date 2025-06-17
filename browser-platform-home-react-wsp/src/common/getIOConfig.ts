import { IOConnectInitSettings } from "@interopio/react-hooks";
import IOWorkspaces from "@interopio/workspaces-api";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import IOModals from "@interopio/modals-api";
import config from "../config.json";

export const getIOConfig = () => {
    const platformConfig: IOConnectBrowserPlatform.Config = {
        ...config,
        browser: {
            libraries: [IOWorkspaces, IOModals],
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
    } as IOConnectBrowserPlatform.Config;

    const ioSettings: IOConnectInitSettings = {
        browserPlatform: {
            factory: async (config) => {
                const browserPlatform = await IOBrowserPlatform(config);

                (window as any).io = browserPlatform.io;

                return browserPlatform;
            },
            config: platformConfig,
        },
    };

    return ioSettings;
};
