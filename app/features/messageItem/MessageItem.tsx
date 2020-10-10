import React from 'react';
import { EmoteTag, Message, UserNoticeMessage } from 'twitch-js';
import styles from './MessageItem.css';

type Props = {
  message: Message | UserNoticeMessage;
  isRead: boolean;
  isCurrent: boolean;
};

const renderEmotes = (message: Message) => {
  const { emotes } = message.tags;
  const msg = message.message;
  let end = 0;

  const parts: any[] = [];

  const sortedEmotes = emotes
    .filter((emote: EmoteTag) => typeof emote.start === 'number')
    .sort((a: EmoteTag, b: EmoteTag) => a.start - b.start);

  sortedEmotes.map((emote: EmoteTag) => {
    const img = (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        key={`${emote.id}-${emote.start}-${emote.end}`}
        src={`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`}
      />
    );

    parts.push(msg.slice(end, emote.start));
    parts.push(img);

    end = emote.end + 1;
    return true;
  });

  parts.push(msg.slice(end));

  return parts;
};

export default function MessageItem(props: Props) {
  const { message, isRead, isCurrent } = props;

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
      key={message.tags.id}
    >
      <div
        className={styles.userName}
        style={{
          color: message.tags.color,
        }}
      >
        {message.username && `${message.username}:`}
      </div>
      <div className={styles.message}>
        {message.systemMessage || renderEmotes(message)}
      </div>
    </div>
  );
}
