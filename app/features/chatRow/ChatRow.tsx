import React, { ReactNode } from 'react';
import { DisplayItem } from '../chat/chatSlice';
import styles from './ChatRow.css';

type Props = {
  data: DisplayItem;
  isRead: boolean;
  isCurrent: boolean;
  isNewest: boolean;
  children: ReactNode;
};

export default function ChatRow(props: Props) {
  const { data, isRead, isCurrent, isNewest, children } = props;

  const fieldRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isCurrent && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        block: 'center',
      });
    }
    if (isNewest && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        block: 'end',
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
