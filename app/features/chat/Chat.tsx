import { remote } from 'electron';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TwitchJs, { Message } from 'twitch-js';
import MessageItem from '../messageItem/MessageItem';
import styles from './Chat.css';
import { addMessage, backMessage, nextMessage, selectChat } from './chatSlice';

// import {
//   increment,
//   decrement,
//   incrementIfOdd,
//   incrementAsync,
//   selectCount,
// } from './counterSlice';

const isPrivateMessage = (message: Message) => {
  return (
    message.command === TwitchJs.Chat.Commands.PRIVATE_MESSAGE &&
    message.event === TwitchJs.Chat.Events.PRIVATE_MESSAGE
  );
};

const isRaid = (message: Message) => {
  return (
    message.command === TwitchJs.Chat.Commands.USER_NOTICE &&
    message.event === TwitchJs.Chat.Events.RAID
  );
};

export default function Chat() {
  const dispatch = useDispatch();
  const { messages, currentMessage } = useSelector(selectChat);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = 'oauth:tce57zyg6h1g089x9enbxumnk7tp9h'; // process.env.TWITCH_TOKEN;
    const username = 'milkdaddy777'; // process.env.TWITCH_USERNAME;
    const channel = '#julianfelixc'.toLocaleLowerCase();
    // const channel = '#milkdaddy777'.toLocaleLowerCase();

    // Instantiate clients.
    const { api, chat } = new TwitchJs({ token, username });

    chat.on(TwitchJs.Chat.Events.PRIVATE_MESSAGE, (message: Message) => {
      console.log(message);
      if (isPrivateMessage(message) || isRaid(message)) {
        delete message.timestamp;
        dispatch(addMessage({ message }));
      }
    });

    chat
      .connect()
      .then(() => {
        // ... and then join the channel.
        chat.join(channel);
        setIsConnected(true);
        return true;
      })
      .catch((e) => {
        setIsConnected(false);
        console.log(e);
      });

    remote.globalShortcut.register('[', () => {
      dispatch(backMessage());
    });

    remote.globalShortcut.register(']', () => {
      dispatch(nextMessage());
    });
  }, [dispatch]);

  return (
    <div>
      <i
        className={[
          styles.connectedIcon,
          isConnected ? styles.connected : styles.disconnected,
          isConnected ? 'far fa-comment-dots' : 'fas fa-comment-slash',
        ].join(' ')}
      />
      {messages.map((message: Message, index: number) => {
        return (
          <MessageItem
            key={`${message.tags.id}-${message.tags.tmiSentTs}`}
            message={message}
            isRead={index < currentMessage}
            isCurrent={index === currentMessage}
          />
        );
      })}
    </div>
  );
}
