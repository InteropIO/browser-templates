export namespace IOConnectBrowser {
    export interface Config {
        [key: string]: unknown;
    }

    export interface API {
        version?: string;
        webPlatform?: {
            version?: string;
        };
        [key: string]: unknown;
    }
}

export type IOConnectBrowserFactoryFunction = (config?: IOConnectBrowser.Config) => Promise<unknown>;

const IOBrowser: IOConnectBrowserFactoryFunction = async (config) => {
    const module = await import("../../browser-client-vanilla-js/public/libs/browser.es.js");
    const factory = module.default as (settings?: IOConnectBrowser.Config) => Promise<unknown>;

    return factory(config);
};

export default IOBrowser;
