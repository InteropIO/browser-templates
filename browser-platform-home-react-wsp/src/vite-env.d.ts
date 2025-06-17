/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_DOMAIN: string
  readonly VITE_AUTH_CLIENT_ID: string
  readonly VITE_AUTH_REDIRECT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}