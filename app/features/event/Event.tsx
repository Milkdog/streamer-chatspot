import React from 'react';
import { PubSubRedemptionMessage } from 'twitch-pubsub-client/lib';
import styles from './Event.css';

type Props = {
  event: PubSubRedemptionMessage;
};

export default function Event(props: Props) {
  const { event } = props;

  return (
    <div className={styles.event}>
      <div>
        {`${event.userName} redeemed ${event.rewardName} (${event.rewardCost} pts)`}
      </div>
      {event.message ? (
        <div className={styles.eventMessage}>{event.message}</div>
      ) : null}
    </div>
  );
}
