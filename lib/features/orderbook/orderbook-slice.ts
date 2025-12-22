import {
  type PayloadAction,
  createSlice,
  prepareAutoBatched,
} from '@reduxjs/toolkit';
import type {
  Order,
  OrdersMessage,
  SubscriptionMessage,
} from '@/lib/features/orderbook/orderbook-api';
import {
  SubscriptionMethod,
  SubscriptionStatus,
  type SubscriptionStatusType,
} from '@/lib/websocket/constants';

export interface BookData {
  asks: Array<Order & { total: number }>;
  bids: Array<Order & { total: number }>;
  subscriptionStatus: SubscriptionStatusType;
  snapshotReceived: boolean;
  timestamp: string;
}

interface OrderBookState {
  [symbol: string]: BookData | undefined;
}

const initialState = {} satisfies OrderBookState as OrderBookState;

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    subscribeOrderBook(state, action: PayloadAction<{ symbol: string }>) {
      const { symbol } = action.payload;
      if (!state[symbol]) {
        state[symbol] = {
          asks: [],
          bids: [],
          subscriptionStatus: SubscriptionStatus.SUBSCRIBING,
          snapshotReceived: false,
          timestamp: '',
        };
      } else {
        state[symbol].subscriptionStatus = SubscriptionStatus.SUBSCRIBING;
      }
    },
    unsubscribeOrderBook(state, action: PayloadAction<{ symbol: string }>) {
      const { symbol } = action.payload;
      if (state[symbol]) {
        state[symbol].subscriptionStatus = SubscriptionStatus.UNSUBSCRIBING;
      }
    },
    setOrderBookSubscriptionStatus(
      state,
      action: PayloadAction<SubscriptionMessage>,
    ) {
      const {
        method,
        result: { symbol },
      } = action.payload;
      if (state[symbol]) {
        if (method === SubscriptionMethod.SUBSCRIBE) {
          state[symbol].subscriptionStatus = SubscriptionStatus.SUBSCRIBED;
        } else {
          state[symbol].asks = [];
          state[symbol].bids = [];
          state[symbol].subscriptionStatus = SubscriptionStatus.UNSUBSCRIBED;
          state[symbol].snapshotReceived = false;
          state[symbol].timestamp = '';
        }
      }
    },
    setOrders: {
      reducer(state, action: PayloadAction<OrdersMessage>) {
        const { type, data } = action.payload;
        const [bookItem] = data;
        const bookState = state[bookItem.symbol];

        if (!bookState) {
          return;
        }

        if (type === 'snapshot') {
          bookState.snapshotReceived = true;
        }

        const prevAsks = bookState.asks;
        const prevBids = bookState.bids;

        const asks = prepareOrders(
          prevAsks,
          bookItem.asks,
          (a, b) => a.price - b.price,
        );
        const bids = prepareOrders(
          prevBids,
          bookItem.bids,
          (a, b) => b.price - a.price,
        );

        bookState.asks = asks;
        bookState.bids = bids;
        bookState.timestamp = bookItem.timestamp ?? new Date().toISOString();
      },
      prepare: prepareAutoBatched<OrdersMessage>(),
    },
  },
  selectors: {
    selectOrderBookBySymbol: (state: OrderBookState, symbol: string) =>
      state[symbol],
  },
});

function prepareOrders(
  prevOrders: Array<Order>,
  incomingOrders: Array<Order>,
  sortFn: (a: { price: number }, b: { price: number }) => number,
) {
  const map = new Map<number, Order>();

  for (const order of prevOrders) {
    if (order.qty !== 0) map.set(order.price, order);
  }

  for (const order of incomingOrders) {
    if (order.qty !== 0) {
      map.set(order.price, order);
    } else {
      map.delete(order.price);
    }
  }

  return Array.from(map.values())
    .sort(sortFn)
    .slice(0, 10)
    .reduce(
      (acc, order) => {
        const total =
          acc.length > 0 ? acc[acc.length - 1].total + order.qty : order.qty;
        acc.push({ ...order, total });
        return acc;
      },
      [] as Array<Order & { total: number }>,
    );
}

export const {
  setOrderBookSubscriptionStatus,
  setOrders,
  subscribeOrderBook,
  unsubscribeOrderBook,
} = orderbookSlice.actions;

export const { selectOrderBookBySymbol } = orderbookSlice.selectors;
