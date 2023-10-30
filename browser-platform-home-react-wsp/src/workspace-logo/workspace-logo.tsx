import { Logo } from '@interopio/workspaces-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { LaunchpadSlidePanel } from '@interopio/home-ui-react';
import { useContext } from 'react';
import { IOConnectContext } from '@interopio/react-hooks';
import { IOConnectBrowser } from '@interopio/browser';

export const WorkspaceLogo = () => {

  const { logout, user } = useAuth0();
  const io = useContext(IOConnectContext) as IOConnectBrowser.API;

  const handleLogout = async () => {
    await io.webPlatform?.system.shutdown();
    logout({ logoutParams: { returnTo: process.env.REACT_APP_AUTH_REDIRECT_URL } });
  };

  return (
    <LaunchpadSlidePanel user={user} onLogout={handleLogout} icon={<Logo frameId='asd' />} />
  );
};
