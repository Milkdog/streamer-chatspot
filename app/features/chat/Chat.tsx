import { remote } from 'electron';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatClient } from 'twitch-chat-client';
import {
  PubSubClient,
  PubSubRedemptionMessage,
  PubSubSubscriptionMessage
} from 'twitch-pubsub-client/lib';
import { ApiClient, CheermoteList } from 'twitch/lib';
import { ElectronAuthProvider } from '../../utils/twitch-electron-auth-provider/src';
import ChatRow from '../chatRow/ChatRow';
import Event from '../event/Event';
import Message from '../message/Message';
import Settings from '../settings/Settings';
import styles from './Chat.css';
import {
  addMessage,
  addRawMessage,
  backMessage,
  DisplayItem,
  goToNewestMessage,
  nextMessage,
  selectChat
} from './chatSlice';
import { selectTwitch, setUser } from './twitchSlice';

type Props = {
  authProvider: ElectronAuthProvider;
  apiClient: ApiClient;
};

export default function Chat(props: Props) {
  const { apiClient, authProvider } = props;
  const dispatch = useDispatch();

  const { messages, currentMessage } = useSelector(selectChat);
  const { user } = useSelector(selectTwitch);

  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isPubSubConnected, setIsPubSubConnected] = useState(false);
  const [cheerMotes, setCheerMotes] = useState<CheermoteList>();
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

    if (user?.name && !isChatConnected) {
      console.log('[Chat] Connecting...', user);
      const client = new ChatClient(authProvider, {
        readOnly: true,
        channels: [user.name],
      });

      setChatClient(client);

      client
        .connect()
        .then((ret) => {
          console.log('[Chat] Connected!');
          setIsChatConnected(true);
          return true;
        })
        .catch(console.log);

      console.log('[Cheermotes] Loading...');
      apiClient.kraken.bits
        .getCheermotes()
        .then((cheermoteList) => {
          console.log('[Cheermotes] Loaded');
          setCheerMotes(cheermoteList);
          return true;
        })
        .catch(console.log);
    }

    if (!isPubSubConnected && user.id) {
      console.log('[PS] Connecting...', user);
      const pubSubClient = new PubSubClient();
      pubSubClient
        .registerUserListener(apiClient, user.id)
        .then(() => {
          console.log('[PS] Connected');
          setIsPubSubConnected(true);
          return true;
        })
        .catch(console.log);

      const redemptionListener = pubSubClient.onRedemption(
        user.id,
        (message: PubSubRedemptionMessage) => {
          console.log(message);
          dispatch(addRawMessage(message));
        }
      );

      const subListener = pubSubClient.onSubscription(
        user.id,
        (message: PubSubSubscriptionMessage) => {
          console.log(message);
          dispatch(addRawMessage(message));
        }
      );
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
  }, [dispatch, user]);

  useEffect(() => {
    if (chatClient) {
      chatClient.onMessage((channel, userName, message, msgData) => {
        dispatch(addMessage({ channel, userName, message, msgData }));
      });
    }
  }, [dispatch, chatClient]);

  // const handleLogout = () => {
  //   console.log('Logging out...');
  //   authProvider.allowUserChange(true);
  //   chatClient.quit();
  //   setIsChatConnected(false);
  //   dispatch(clearUser());

  //   // Trigger login
  //   // authProvider
  //   //   .getAccessToken()
  //   //   .then((token) => {
  //   //     console.log(token);
  //   //     dispatch(setUser(token));
  //   //     return true;
  //   //   })
  //   //   .catch(console.log);
  // };

  if (!cheerMotes) {
    return <div className={styles.chatBox}>Connecting to Twitch...</div>;
  }

  return (
    <div className={styles.chatBox}>
      <div className={styles.menuBar}>
        <Settings />
        <i
          className={[
            styles.connectedIcon,
            isChatConnected ? styles.connected : styles.disconnected,
            isChatConnected ? 'far fa-comment-dots' : 'fas fa-comment-slash',
          ].join(' ')}
        />
      </div>
      {/* <div className={styles.futureMessageContainer}>6 messages below</div> */}
      {/* <i className="fas fa-sign-out-alt" onClick={handleLogout} /> */}
      {messages.map((userMessage: DisplayItem, index: number) => {
        let rowContents;
        let key = '';

        if (userMessage.msgData) {
          key =
            userMessage.msgData.tags.get('id') ||
            userMessage.msgData.tags.get('client-nonce');
          rowContents = (
            <Message cheermoteList={cheerMotes} userMessage={userMessage} />
          );
        }

        if (userMessage.rewardId) {
          key = userMessage.id;
          rowContents = <Event event={userMessage} />;
        }

        if (userMessage.subPlan) {
          key = userMessage.id;
          rowContents = <Event event={userMessage} />;
        }

        return (
          // eslint-disable-next-line react/jsx-key
          <ChatRow
            key={key}
            data={userMessage}
            isRead={index < currentMessage}
            isCurrent={index === currentMessage}
          >
            {rowContents}
          </ChatRow>
        );
      })}
    </div>
  );
}
