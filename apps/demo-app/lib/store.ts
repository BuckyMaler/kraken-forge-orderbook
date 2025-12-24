import { combineSlices, configureStore } from '@reduxjs/toolkit';
import throttle from 'lodash-es/throttle';
import { orderbookMiddleware } from '@/lib/features/orderbook/orderbook-middleware';
import { orderbookSlice } from '@/lib/features/orderbook/orderbook-slice';
import { websocketMiddleware } from '@/lib/websocket/websocket-middleware';
import { websocketSlice } from '@/lib/websocket/websocket-slice';

const rootReducer = combineSlices(websocketSlice, orderbookSlice);

const throttledNotify = throttle((notify: () => void) => notify(), 300);

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(websocketMiddleware, orderbookMiddleware),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers({
        // This configures RTK's `autoBatchEnhancer` to throttle subscription
        // notifications by 300ms, which effectively batches React updates, to
        // improve performance when many actions are dispatched in a short time.
        // Only actions with the `action.meta[SHOULD_AUTOBATCH]` field, which can
        // be added using the `prepareAutoBatched` utility, will be throttled.
        // https://redux-toolkit.js.org/api/autoBatchEnhancer
        autoBatch: { type: 'callback', queueNotification: throttledNotify },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
