import { remote } from 'electron';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatClient } from 'twitch-chat-client';
import { ApiClient } from 'twitch/lib';
import MessageItem from '../messageItem/MessageItem';
import styles from './Chat.css';
import {
  addMessage,
  backMessage,
  goToNewestMessage,
  nextMessage,
  selectChat
} from './chatSlice';
import { selectTwitch, setUser } from './twitchSlice';
import { ElectronAuthProvider } from './utils/twitch-electron-auth-provider/src';

type Props = {
  authProvider: ElectronAuthProvider;
  apiClient: ApiClient;
};

export default function Chat(props: Props) {
  const { apiClient, authProvider } = props;
  const dispatch = useDispatch();

  const { messages, currentMessage } = useSelector(selectChat);
  const { user } = useSelector(selectTwitch);

  const [isConnected, setIsConnected] = useState(false);
  const [chatClient, setChatClient] = useState<ChatClient>();

  useEffect(() => {
    if (!user.id) {
      apiClient
        .getTokenInfo()
        .then((token) => {
          dispatch(setUser(token));
          return token;
        })
        .catch(console.log);
    }

    if (user?.name && !isConnected) {
      console.log('Connecting...', user);
      const client = new ChatClient(authProvider, {
        readOnly: true,
        channels: [user.name],
      });

      setChatClient(client);

      client
        .connect()
        .then((ret) => {
          console.log('Connected!');
          setIsConnected(true);
          return true;
        })
        .catch(console.log);
    }

    remote.globalShortcut.register('[', () => {
      dispatch(backMessage());
    });

    remote.globalShortcut.register(']', () => {
      dispatch(nextMessage());
    });

    remote.globalShortcut.register('CommandOrControl+]', () => {
      dispatch(goToNewestMessage());
    });

    // // TODO: Jump to newest message
  }, [dispatch, user, isConnected]);

  useEffect(() => {
    if (chatClient) {
      chatClient.onMessage((channel, userName, message, msgData) => {
        dispatch(addMessage({ channel, userName, message, msgData }));
      });
    }
  }, [dispatch, chatClient]);

  return (
    <div>
      <i
        className={[
          styles.connectedIcon,
          isConnected ? styles.connected : styles.disconnected,
          isConnected ? 'far fa-comment-dots' : 'fas fa-comment-slash',
        ].join(' ')}
      />
      {messages.map((msgData: PrivateMessage, index: number) => {
        // console.log(msgData.tags);
        return (
          // eslint-disable-next-line react/jsx-key
          <MessageItem
            key={`${msgData.username}-${msgData.timestamp}`}
            msgData={msgData}
            isRead={index < currentMessage}
            isCurrent={index === currentMessage}
          />
        );
      })}
    </div>
  );
}
