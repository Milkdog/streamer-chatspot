import React, { ReactNode } from 'react';
import {
  ParsedMessageCheerPart,
  ParsedMessageEmotePart
} from 'twitch-chat-client';
import { DisplayItem } from '../chat/chatSlice';
import styles from './ChatRow.css';

type Props = {
  data: DisplayItem;
  isRead: boolean;
  isCurrent: boolean;
  children: ReactNode;
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

export default function ChatRow(props: Props) {
  const { data, isRead, isCurrent, children } = props;

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
    >
      {children}
    </div>
  );
}
