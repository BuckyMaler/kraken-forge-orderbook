import { z } from 'zod';
import {
  SubscriptionMethod,
  type SubscriptionMethodType,
} from '@/lib/websocket/constants';

const ORDERBOOK_CHANNEL = 'book';

export function createOrderBookMessage(
  method: SubscriptionMethodType,
  symbol: string,
) {
  return {
    method,
    params: {
      channel: ORDERBOOK_CHANNEL,
      symbol: [symbol],
    },
  };
}

export const subscriptionMessageSchema = z.object({
  method: z.enum([
    SubscriptionMethod.SUBSCRIBE,
    SubscriptionMethod.UNSUBSCRIBE,
  ]),
  result: z.object({
    channel: z.literal(ORDERBOOK_CHANNEL),
    symbol: z.string(),
  }),
});

export type SubscriptionMessage = z.infer<typeof subscriptionMessageSchema>;

const orderSchema = z.object({ price: z.number(), qty: z.number() });

export type Order = z.infer<typeof orderSchema>;

export const ordersMessageSchema = z.object({
  channel: z.literal(ORDERBOOK_CHANNEL),
  type: z.enum(['snapshot', 'update']),
  data: z
    .array(
      z.object({
        symbol: z.string(),
        asks: z.array(orderSchema),
        bids: z.array(orderSchema),
        timestamp: z.string().optional(),
      }),
    )
    .length(1),
});

export type OrdersMessage = z.infer<typeof ordersMessageSchema>;
