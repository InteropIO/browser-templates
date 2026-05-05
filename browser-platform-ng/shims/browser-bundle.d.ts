declare module "../../browser-client-vanilla-js/public/libs/browser.es.js" {
    const factory: (config?: Record<string, unknown>) => Promise<unknown>;
    export default factory;
}

declare module "../../browser-platform-vanilla-js/public/libs/browser.platform.es.js" {
    const factory: (config?: Record<string, unknown>) => Promise<unknown>;
    export default factory;
}
