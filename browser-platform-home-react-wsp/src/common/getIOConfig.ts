import { IOConnectInitSettings } from "@interopio/react-hooks";
import IOWorkspaces from "@interopio/workspaces-api";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import IOModals from "@interopio/modals-api";
import config from "../config.json";

export const getIOConfig = () => {
    const platformConfig: IOConnectBrowserPlatform.Config = {
        ...config,
        modals: {
            sources: {
                bundle: `${process.env.PUBLIC_URL}/resources/modals/io-browser-modals-ui.es.js`,
                styles: [`${process.env.PUBLIC_URL}/resources/modals/styles.css`],
                fonts: [`${process.env.PUBLIC_URL}/resources/modals/fonts.css`],
            },
        },
        intentResolver: {
            sources: {
                bundle: `${process.env.PUBLIC_URL}/resources/intent-resolver/io-browser-intent-resolver-ui.es.js`,
                styles: [`${process.env.PUBLIC_URL}/resources/intent-resolver/styles.css`],
                fonts: [`${process.env.PUBLIC_URL}/resources/intent-resolver/fonts.css`],
            },
        },
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
