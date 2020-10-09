import TwitchJs, { ApiVersions, Message } from 'twitch-js';
import React from 'react';
import Home from '../components/Home';
import Chat from '../features/chat/Chat';

export default function HomePage() {
  // // Provide your token, username and channel. You can generate a token here:
  // // https://twitchapps.com/tmi/
  // const token = 'oauth:tce57zyg6h1g089x9enbxumnk7tp9h'; // process.env.TWITCH_TOKEN;
  // const username = 'milkdaddy777'; // process.env.TWITCH_USERNAME;

  // const channel = '#milkdaddy777';

  // // Instantiate clients.
  // const { api, chat } = new TwitchJs({ token, username });

  // // Listen for all messages.
  // chat.on(TwitchJs.Chat.Events.ALL, (message) => {
  //   // Use discriminated unions on `message.command` and `message.event` to
  //   // determine the type of `message`.
  //   if (
  //     message.command === TwitchJs.Chat.Commands.USER_NOTICE &&
  //     message.event === TwitchJs.Chat.Events.SUBSCRIPTION
  //   ) {
  //     console.log(message.parameters.subPlan);
  //     // Do stuff with subscription message ...
  //   }
  // });

  // // Connect ...
  // chat
  //   .connect()
  //   .then(() => {
  //     // ... and then join the channel.
  //     chat.join(channel);
  //     return true;
  //   })
  //   .catch(console.log);

  // return <Home />;
  return <Chat />;
}
