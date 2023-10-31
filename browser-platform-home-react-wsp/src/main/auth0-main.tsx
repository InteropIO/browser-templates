import { Auth0Provider } from "@auth0/auth0-react";
import { IOConnectHomeProvider } from "@interopio/home-ui-react";
import { App } from "../app";

export const Main = () => {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH_DOMAIN as string}
            clientId={process.env.REACT_APP_AUTH_CLIENT_ID as string}
            authorizationParams={{
                redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URL,
            }}
        >
            <IOConnectHomeProvider>
                <App />
            </IOConnectHomeProvider>
        </Auth0Provider>
    );
};
