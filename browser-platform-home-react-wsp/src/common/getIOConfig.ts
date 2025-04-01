import { IOConnectInitSettings } from "@interopio/react-hooks";
import IOWorkspaces from "@interopio/workspaces-api";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import config from "../config.json";

export const getIOConfig = () => {
    const platformConfig = Object.assign({}, config, { browser: { libraries: [IOWorkspaces] } }) as IOConnectBrowserPlatform.Config;

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
