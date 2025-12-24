import { Middleware } from '@reduxjs/toolkit';
import {
  createOrderBookMessage,
  ordersMessageSchema,
  subscriptionMessageSchema,
} from '@/lib/features/orderbook/orderbook-api';
import {
  setOrderBookSubscriptionStatus,
  setOrders,
  subscribeOrderBook,
  unsubscribeOrderBook,
} from '@/lib/features/orderbook/orderbook-slice';
import { SubscriptionMethod } from '@/lib/websocket/constants';
import {
  receiveWebSocketMessage,
  sendWebSocketMessage,
} from '@/lib/websocket/websocket-slice';

export const orderbookMiddleware: Middleware = (store) => {
  return (next) => (action) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: `action` is of type `unknown`
    switch (action.type) {
      case subscribeOrderBook.type: {
        const orderbookMessage = createOrderBookMessage(
          SubscriptionMethod.SUBSCRIBE,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: `action` is of type `unknown`
          action.payload.symbol,
        );
        store.dispatch(sendWebSocketMessage(orderbookMessage));
        break;
      }
      case unsubscribeOrderBook.type: {
        const orderbookMessage = createOrderBookMessage(
          SubscriptionMethod.UNSUBSCRIBE,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: `action` is of type `unknown`
          action.payload.symbol,
        );
        store.dispatch(sendWebSocketMessage(orderbookMessage));
        break;
      }
      case receiveWebSocketMessage.type: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: `action` is of type `unknown`
        const data = action.payload;

        const ordersMessageResult = ordersMessageSchema.safeParse(data);
        if (ordersMessageResult.success) {
          store.dispatch(setOrders(ordersMessageResult.data));
          break;
        }

        const subscriptionMessageResult =
          subscriptionMessageSchema.safeParse(data);
        if (subscriptionMessageResult.success) {
          store.dispatch(
            setOrderBookSubscriptionStatus(subscriptionMessageResult.data),
          );
          break;
        }
        break;
      }
      default:
        break;
    }
    return next(action);
  };
};
