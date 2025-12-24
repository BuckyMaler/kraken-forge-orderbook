'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createPingMessage } from '@/lib/websocket/websocket-api';
import {
  connectWebSocket,
  selectWebSocketStatus,
  sendWebSocketMessage,
} from '@/lib/websocket/websocket-slice';

interface WebsocketProviderProps {
  readonly children: React.ReactNode;
}

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const dispatch = useAppDispatch();
  const websocketStatus = useAppSelector(selectWebSocketStatus);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(connectWebSocket());
  }, [dispatch]);

  useEffect(() => {
    if (websocketStatus === 'open') {
      intervalRef.current = setInterval(() => {
        const pingMessage = createPingMessage();
        dispatch(sendWebSocketMessage(pingMessage));
      }, 15000);
    }

    if (websocketStatus === 'closed' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [websocketStatus, dispatch]);

  return children;
}
