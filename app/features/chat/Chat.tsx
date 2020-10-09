import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TwitchJs, { Message } from 'twitch-js';
import MessageItem from '../messageItem/MessageItem';
import styles from './Chat.css';
import { addMessage, selectChat } from './chatSlice';
// import {
//   increment,
//   decrement,
//   incrementIfOdd,
//   incrementAsync,
//   selectCount,
// } from './counterSlice';

export default function Chat() {
  const dispatch = useDispatch();
  const messages = useSelector(selectChat);

  const [currentMessage, setCurrentMessage] = useState(2);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Connecting....');
    const token = 'oauth:tce57zyg6h1g089x9enbxumnk7tp9h'; // process.env.TWITCH_TOKEN;
    const username = 'milkdaddy777'; // process.env.TWITCH_USERNAME;
    const channel = '#milkdaddy777';

    // Instantiate clients.
    const { api, chat } = new TwitchJs({ token, username });

    chat.on(TwitchJs.Chat.Events.PRIVATE_MESSAGE, (message: Message) => {
      dispatch(addMessage({ message }));
    });

    chat
      .connect()
      .then(() => {
        // ... and then join the channel.
        chat.join(channel);
        setIsConnected(true);
        return true;
      })
      .catch(console.log);

    // globalShortcut.register('CmdOrCtrl+A', () => {
    //   // your call
    //   console.log('Pushed');
    // });
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
            key={message.tags.id}
            message={message}
            isRead={index < currentMessage}
            isCurrent={index === currentMessage}
          />
        );
      })}
    </div>
  );
}
