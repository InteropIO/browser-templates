import '@interopio/workspaces-ui-react/dist/styles/workspaces.css';
import { IOConnectProvider } from '@interopio/react-hooks';
import Workspaces from '@interopio/workspaces-ui-react';
import { PermissionsSetup, useIOConnectHome } from '@interopio/home-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

import { WorkspaceLogo } from '../workspace-logo';
import { LoginPage } from "../login";

import { getIoConfig } from '../common/getIoConfig';

export const App = () => {
    const { isAuthenticated } = useAuth0();
    const { permission } = useIOConnectHome();

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    if (!permission.isSetupCompleted) {
        return <PermissionsSetup />;
    }

    const ioConfig = getIoConfig();

    return (
        <IOConnectProvider settings={ioConfig}>
            <Workspaces
                components={{
                    header: { LogoComponent: () => <WorkspaceLogo /> },
                }}
            />
        </IOConnectProvider>
    );
};
