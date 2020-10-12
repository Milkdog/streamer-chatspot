/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApiClient } from 'twitch';
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

const clientId = 'go8akiwr4kocf9mmcisofgluipvtio';
const secret = '9c4hf9xby3vsjiedbc4ay4rpyjfx50';
const redirectUri = 'http://localhost:3000/login';

const authProvider = new ElectronAuthProvider({
  clientId,
  redirectUri,
});

const apiClient = new ApiClient({
  authProvider,
  initialScopes: ['channel:read:redemptions'],
});

export default function Routes() {
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
