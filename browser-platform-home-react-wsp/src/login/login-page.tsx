import { FC } from 'react'
import { LoginLoader, LoginAuth0 } from '@interopio/home-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

export interface LoginPageProps {
  className?: string;
}

const LoginPage: FC<LoginPageProps> = () => {

  const { loginWithRedirect, isLoading, error } = useAuth0();

  return (
    <div className="welcome flex flex-column ai-center">
      {isLoading ?
        <LoginLoader /> :
        <LoginAuth0
          onLogin={loginWithRedirect}
        />}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error.message}</p>}
    </div>
  )
}

export default LoginPage
