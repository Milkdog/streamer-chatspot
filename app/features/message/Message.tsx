import React from 'react';
import {
  ParsedMessageCheerPart,
  ParsedMessageEmotePart,
  ParsedMessagePart
} from 'twitch-chat-client';
import { CheermoteList } from 'twitch/lib';
import { UserMessage } from '../chat/chatSlice';
import styles from './Message.css';

type Props = {
  cheermoteList: CheermoteList;
  userMessage: UserMessage;
};

type EmoteProps = {
  emote: ParsedMessageEmotePart;
};

type CheerProps = {
  cheer: ParsedMessageCheerPart;
};

export function Emote(props: EmoteProps) {
  const { emote } = props;
  return (
    <img
      key={`${emote.id}-${emote.position}-${emote.length}`}
      src={`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`}
      alt={emote.name}
    />
  );
}

export function Cheer(props: CheerProps) {
  const { cheer } = props;
  return (
    <span>
      <img src={cheer.displayInfo.url} alt={cheer.name} />
      <span style={{ color: cheer.displayInfo.color, fontWeight: 'bold' }}>
        {cheer.amount}
      </span>
    </span>
  );
}

export default function Message(props: Props) {
  const { cheermoteList, userMessage } = props;

  return (
    <div>
      <div
        className={styles.userName}
        style={{
          color: userMessage.user.color,
        }}
      >
        {userMessage.msgData.userInfo.displayName &&
          `${userMessage.msgData.userInfo.displayName}:`}
      </div>
      <div className={styles.message}>
        {userMessage.msgData
          .parseEmotesAndBits(cheermoteList)
          .map((msgPart: ParsedMessagePart) => {
            if (msgPart.type === 'emote') {
              return <Emote key={msgPart.position} emote={msgPart} />;
            }

            if (msgPart.type === 'cheer') {
              return <Cheer key={msgPart.position} cheer={msgPart} />;
            }

            return <span key={msgPart.position}>{msgPart.text}</span>;
          })}
      </div>
    </div>
  );
}
