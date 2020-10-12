import React from 'react';
import { ApiClient } from 'twitch/lib';
import Chat from '../features/chat/Chat';
import { ElectronAuthProvider } from './utils/twitch-electron-auth-provider/src';

type Props = {
  authProvider: ElectronAuthProvider;
  apiClient: ApiClient;
};

export default function HomePage(props: Props) {
  const { apiClient, authProvider } = props;

  return <Chat authProvider={authProvider} apiClient={apiClient} />;
}
