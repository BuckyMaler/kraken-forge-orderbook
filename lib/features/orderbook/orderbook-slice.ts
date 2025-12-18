import {
  type PayloadAction,
  createSelector,
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

interface OrderBookState {
  [symbol: string]: {
    asks: Array<Order & { total: number }>;
    bids: Array<Order & { total: number }>;
    subscriptionStatus: SubscriptionStatusType;
    snapshotReceived: boolean;
  };
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
        }
      }
    },
    setOrders: {
      reducer(state, action: PayloadAction<OrdersMessage>) {
        const { type, data } = action.payload;
        const [bookItem] = data;

        if (!state[bookItem.symbol]) {
          return;
        }

        if (type === 'snapshot') {
          state[bookItem.symbol].snapshotReceived = true;
        }

        const prevAsks = state[bookItem.symbol].asks;
        const prevBids = state[bookItem.symbol].bids;

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

        state[bookItem.symbol].asks = asks;
        state[bookItem.symbol].bids = bids;
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

export const selectSpreadBySymbol = createSelector(
  [selectOrderBookBySymbol],
  (bookData) => {
    if (bookData && bookData.asks.length > 0 && bookData.bids.length > 0) {
      const lowestAsk = bookData.asks[0].price;
      const highestBid = bookData.bids[0].price;
      const spread = lowestAsk - highestBid;
      const relativeSpread = (spread / lowestAsk) * 100;
      return { spread, relativeSpread };
    }
    return { spread: null, relativeSpread: null };
  },
);
