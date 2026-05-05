export namespace IOConnectBrowserPlatform {
    export interface Config {
        [key: string]: unknown;
    }
}

export type IOConnectBrowserPlatformFactoryFunction = (config?: IOConnectBrowserPlatform.Config) => Promise<unknown>;

const IOBrowserPlatform: IOConnectBrowserPlatformFactoryFunction = async (config) => {
    // Reuse the checked-in 4.4 bundle from the sibling browser-platform-vanilla-js template.
    // This keeps browser-platform-ng src imports and its dependency list unchanged for the
    // package refresh task, but it intentionally depends on that sibling template path.
    const module = await import("../../browser-platform-vanilla-js/public/libs/browser.platform.es.js");
    const factory = module.default as (settings?: IOConnectBrowserPlatform.Config) => Promise<unknown>;

    return factory(config);
};

export default IOBrowserPlatform;
