import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "../common/getIOConfig";
import { useMemo } from "react";

export const Auth0Main = () => {
    const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
        () => ({
            getIOConnectConfig: getIOConfig,
            login: {
                type: 'auth0',
                providerOptions: {
                    domain: import.meta.env.VITE_AUTH_DOMAIN as string,
                    clientId: import.meta.env.VITE_AUTH_CLIENT_ID as string,
                    authorizationParams: {
                        redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URL,
                    },
                },
            }
        }),
        []
    );

    return <IOConnectHome config={ioConnectHomeConfig} />;
};
