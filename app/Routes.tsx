/* eslint react/jsx-props-no-spreading: off */
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { ApiClient } from 'twitch';
import { AccessToken } from 'twitch-auth';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import { ElectronAuthProvider } from './utils/twitch-electron-auth-provider/src';

// import { ChatClient } from 'twitch-chat-client';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  const [authProvider, setAuthProvider] = useState<ElectronAuthProvider>();
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const [apiClient, setApiClient] = useState<ApiClient>();

  useEffect(() => {
    const clientId = 'go8akiwr4kocf9mmcisofgluipvtio';
    const redirectUri = 'http://localhost/';

    const tempAuthProvider = new ElectronAuthProvider({
      clientId,
      redirectUri,
    });

    tempAuthProvider
      .getAccessToken(['chat:read', 'channel:read:redemptions', 'bits:read'])
      .then(setAccessToken)
      .catch(console.log);

    setAuthProvider(tempAuthProvider);
  }, []);

  useEffect(() => {
    // console.log('[AUTH]', authProvider);
    if (authProvider) {
      setApiClient(
        new ApiClient({
          authProvider,
        })
      );
    }
  }, [authProvider]);

  if (!authProvider || !apiClient || !accessToken || !accessToken.accessToken) {
    return <div>Please login.</div>;
  }

  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route
          path={routes.HOME}
          render={() => (
            <HomePage authProvider={authProvider} apiClient={apiClient} />
          )}
        />
      </Switch>
    </App>
  );
}
