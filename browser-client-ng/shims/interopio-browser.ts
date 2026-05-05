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
    // Reuse the checked-in 4.4 bundle from the sibling browser-client-vanilla-js template.
    // This keeps browser-client-ng src imports and its dependency list unchanged for the
    // package refresh task, but it intentionally depends on that sibling template path.
    const module = await import("../../browser-client-vanilla-js/public/libs/browser.es.js");
    const factory = module.default as (settings?: IOConnectBrowser.Config) => Promise<unknown>;

    return factory(config);
};

export default IOBrowser;
