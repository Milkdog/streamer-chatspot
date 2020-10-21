import React from 'react';
import {
  PubSubRedemptionMessage,
  PubSubSubscriptionMessage
} from 'twitch-pubsub-client/lib';
import { EventMessage } from '../chat/chatSlice';
import styles from './Event.css';

type Props = {
  event: EventMessage;
};

const renderRedemption = (event: PubSubRedemptionMessage) => {
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
};

const subMessage = (event: PubSubSubscriptionMessage) => {
  /*
cumulativeMonths
giftDuration
gifterDisplayName
gifterId
gifterName
isAnonymous
isGift
isResub
message
months
streakMonths
subPlan
time
userDisplayName
userId
userName

benefit_end_month: 0
user_name: "milkdaddy777"
display_name: "MilkDaddy777"
channel_name: "julianfelixc"
user_id: "135735482"
channel_id: "122852654"
time: "2020-10-15T02:49:13.424042936Z"
sub_message: {message: "Love you!", emotes: null}
sub_plan: "1000"
sub_plan_name: "Channel Subscription (julianfelixc)"
months: 0
cumulative_months: 4
streak_months: 4
context: "resub"
is_gift: false
multi_month_duration: 0

userId: "135735482"
userName: "milkdaddy777"
userDisplayName: "MilkDaddy777"
streakMonths: undefined
cumulativeMonths: undefined
months: undefined
time: Wed Oct 14 2020 19:49:13 GMT-0700 (Pacific Daylight Time)
message: Object
subPlan: "1000"
isResub: true
isGift: false
isAnonymous: false
gifterId: null
gifterName: null
gifterDisplayName: null
giftDuration: null
  */

  const subLength = event.giftDuration
    ? ` for ${event.giftDuration} months`
    : null;

  const tier = (tierCode: string) => {
    switch (tierCode) {
      case 'Prime':
        return 'a Prime sub';
      case '1000':
        return 'at Tier 1';
      case '2000':
        return 'at Tier 2';
      case '3000':
        return 'at Tier 3';
      default:
        return null;
    }
  };

  if (event.isResub) {
    return `${event.userDisplayName} resubbed on month ${
      event.months
    } at ${tier(event.subPlan)}`;
  }

  if (event.isGift) {
    const gifterName = event.isAnonymous
      ? 'Anonymous'
      : event.gifterDisplayName;

    return `${gifterName} gifted ${tier(event.subPlan)} to ${
      event.userDisplayName
    }${subLength}`;
  }

  return `${event.userName} has subbed ${tier(event.subPlan)}${subLength}`;
};

const renderSubscription = (event: PubSubRedemptionMessage) => {
  return (
    <div className={styles.event}>
      <div>{subMessage(event)}</div>
      {event.message ? (
        <div className={styles.eventMessage}>{event.message}</div>
      ) : null}
    </div>
  );
};

export default function Event(props: Props) {
  const { event } = props;

  if (event.rewardId) {
    return renderRedemption(event);
  }

  // if (event.subPlan) {
  //   return renderSubscription(event);
  // }

  console.warn('[Missed event render', event);
  return null;
}
