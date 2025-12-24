import { Middleware } from '@reduxjs/toolkit';
import {
  connectWebSocket,
  disconnectWebSocket,
  receiveWebSocketMessage,
  sendWebSocketMessage,
  setWebSocketStatus,
} from '@/lib/websocket/websocket-slice';

export const websocketMiddleware: Middleware = (store) => {
  let ws: WebSocket | null = null;

  return (next) => (action) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: `action` is of type `unknown`
    switch (action.type) {
      case connectWebSocket.type:
        ws = new WebSocket('wss://ws.kraken.com/v2');

        ws.onopen = () => {
          store.dispatch(setWebSocketStatus('open'));
        };

        ws.onclose = () => {
          ws = null;
          store.dispatch(setWebSocketStatus('closed'));
        };

        ws.onmessage = (message) => {
          try {
            const data = JSON.parse(message.data);
            store.dispatch(receiveWebSocketMessage(data));
          } catch {}
        };

        break;
      case disconnectWebSocket.type:
        if (ws) {
          ws.close();
        }
        break;
      case sendWebSocketMessage.type:
        if (ws && ws.readyState === WebSocket.OPEN) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: `action` is of type `unknown`
          ws.send(JSON.stringify(action.payload));
        }
        break;
      default:
        break;
    }
    return next(action);
  };
};
