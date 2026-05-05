export namespace IOConnectBrowserPlatform {
    export interface Config {
        [key: string]: unknown;
    }
}

export type IOConnectBrowserPlatformFactoryFunction = (config?: IOConnectBrowserPlatform.Config) => Promise<unknown>;

const IOBrowserPlatform: IOConnectBrowserPlatformFactoryFunction = async (config) => {
    const module = await import("../../browser-platform-vanilla-js/public/libs/browser.platform.es.js");
    const factory = module.default as (settings?: IOConnectBrowserPlatform.Config) => Promise<unknown>;

    return factory(config);
};

export default IOBrowserPlatform;
