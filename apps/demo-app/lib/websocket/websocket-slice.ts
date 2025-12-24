import {
  type PayloadAction,
  createSlice,
  prepareAutoBatched,
} from '@reduxjs/toolkit';

interface WebSocketState {
  status: 'uninstantiated' | 'connecting' | 'open' | 'closing' | 'closed';
}

const initialState = {
  status: 'uninstantiated',
} satisfies WebSocketState as WebSocketState;

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectWebSocket(state) {
      state.status = 'connecting';
    },
    disconnectWebSocket(state) {
      state.status = 'closing';
    },
    setWebSocketStatus(state, action: PayloadAction<WebSocketState['status']>) {
      state.status = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendWebSocketMessage(_, action: PayloadAction<object>) {},
    receiveWebSocketMessage: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      reducer(_, action: PayloadAction<object>) {},
      prepare: prepareAutoBatched<object>(),
    },
  },
  selectors: {
    selectWebSocketStatus: (state) => state.status,
  },
});

export const {
  connectWebSocket,
  disconnectWebSocket,
  receiveWebSocketMessage,
  sendWebSocketMessage,
  setWebSocketStatus,
} = websocketSlice.actions;

export const { selectWebSocketStatus } = websocketSlice.selectors;
