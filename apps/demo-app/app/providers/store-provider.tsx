'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { type AppStore, makeStore } from '@/lib/store';

interface StoreProviderProps {
  readonly children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>;
}
