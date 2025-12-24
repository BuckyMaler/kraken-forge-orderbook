export const enum SubscriptionMethod {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
}

export type SubscriptionMethodType = `${SubscriptionMethod}`;

export const enum SubscriptionStatus {
  SUBSCRIBING = 'subscribing',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBING = 'unsubscribing',
  UNSUBSCRIBED = 'unsubscribed',
}

export type SubscriptionStatusType = `${SubscriptionStatus}`;
