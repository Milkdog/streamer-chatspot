import React, { ReactNode } from 'react';
import { DisplayItem } from '../chat/chatSlice';
import styles from './ChatRow.css';

type Props = {
  data: DisplayItem;
  isRead: boolean;
  isCurrent: boolean;
  children: ReactNode;
};

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
