import '@interopio/workspaces-ui-react/dist/styles/workspaces.css';
import { IOConnectProvider, IOConnectInitSettings } from '@interopio/react-hooks';
import IOBrowserPlatform, { IOConnectBrowserPlatform } from '@interopio/browser-platform';
import Workspaces from '@interopio/workspaces-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { WorkspaceLogo } from './workspace-logo';
import './app.css';
import LoginPage from './login/login-page';
import { useEffect, useState } from 'react';
import { LoginLoader, PermissionsSetup, useIOConnectHome } from '@interopio/home-ui-react';
import config from './config.json';

const App = () => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const { permission } = useIOConnectHome();
    const [IOSettings, setIOSettings] = useState<any>(null);

    useEffect(() => {

        if (!isAuthenticated) {
            return;
        }

        const compileSettings = async () => {
            const ioSettings: IOConnectInitSettings = {
                browserPlatform: {
                    factory: IOBrowserPlatform,
                    config: config as IOConnectBrowserPlatform.Config,
                },
            };

            setIOSettings(ioSettings);
        };

        compileSettings();

    }, [isAuthenticated, getAccessTokenSilently, user]);

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    if (!permission.isSetupCompleted) {
        return <PermissionsSetup />;
    }

    if (IOSettings) {
        return (
            <IOConnectProvider settings={IOSettings}>
                <Workspaces
                    components={{
                        header: { LogoComponent: () => <WorkspaceLogo /> },
                    }}
                />
            </IOConnectProvider>
        );
    }

    return (
        <div className="welcome flex flex-column ai-center">
            <LoginLoader />
        </div>
    );
}

export default App;
