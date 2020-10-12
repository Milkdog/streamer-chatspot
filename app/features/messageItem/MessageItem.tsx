import React from 'react';
import { ParsedMessagePart, PrivateMessage } from 'twitch-chat-client';
import styles from './MessageItem.css';

type Props = {
  msgData: PrivateMessage;
  isRead: boolean;
  isCurrent: boolean;
};

type EmoteProps = {
  emote: ParsedMessageEmotePart;
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

export default function MessageItem(props: Props) {
  const { msgData, isRead, isCurrent } = props;

  const fieldRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isCurrent && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        block: 'center',
      });
    }
  });

  return (
    <div
      ref={fieldRef}
      className={[
        styles.chatRow,
        isRead ? styles.chatRowRead : '',
        isCurrent ? styles.chatRowCurrent : '',
      ].join(' ')}
      // key={message.tags.id}
    >
      <div
        className={styles.userName}
        style={
          {
            // color: msgData.userColor,
          }
        }
      >
        {msgData.userInfo.displayName && `${msgData.userInfo.displayName}:`}
      </div>
      <div className={styles.message}>
        {msgData.parseEmotes().map((msgPart: ParsedMessagePart) => {
          if (msgPart.type === 'emote') {
            return <Emote key={msgPart.position} emote={msgPart} />;
          }

          // eslint-disable-next-line react/jsx-key
          return <span key={msgPart.position}>{msgPart.text}</span>;
        })}
      </div>
    </div>
  );
}
