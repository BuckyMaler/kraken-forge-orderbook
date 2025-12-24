'use client';

import { HistoryIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderBook } from '@/app/orderbook/components/orderbook';
import {
  OrderBookTable,
  OrderBookTableSkeleton,
} from '@/app/orderbook/components/orderbook-table';
import {
  OrderBookSpread,
  OrderBookSpreadContent,
} from '@/app/orderbook/components/orderbook-spread';
import { CustomSlider } from '@/components/custom-slider';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import {
  selectOrderBookBySymbol,
  subscribeOrderBook,
  unsubscribeOrderBook,
} from '@/lib/features/orderbook/orderbook-slice';
import { DEFAULT_TOKEN, TOKENS } from '@/lib/features/tokens/tokens';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectWebSocketStatus } from '@/lib/websocket/websocket-slice';

export function OrderBookContainer() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || DEFAULT_TOKEN.symbol;
  const prevSymbolRef = useRef<string>(symbol);
  const token = TOKENS.find((token) => token.symbol === symbol);
  const dispatch = useAppDispatch();
  const websocketStatus = useAppSelector(selectWebSocketStatus);
  const bookPresent = useAppSelector((state) =>
    selectOrderBookBySymbol(state, symbol),
  );

  useEffect(() => {
    if (websocketStatus !== 'open' || !token) {
      return;
    }

    const prevSymbol = prevSymbolRef.current;
    if (prevSymbol !== symbol) {
      dispatch(unsubscribeOrderBook({ symbol: prevSymbol }));
    }

    dispatch(subscribeOrderBook({ symbol }));
    prevSymbolRef.current = symbol;

    return () => {
      dispatch(unsubscribeOrderBook({ symbol }));
    };
  }, [websocketStatus, token, symbol, dispatch]);

  // TODO: Add token not found state (low priority)
  // This will only happen if the user manually edits
  // the URL to an unsupported symbol.
  if (!token) {
    return null;
  }

  if (!bookPresent || !bookPresent.snapshotReceived) {
    return (
      <Card>
        <CardContent className="px-0">
          <OrderBookSpread>
            <OrderBookSpreadContent>
              <span className="font-normal">Spread:</span>
              <Skeleton className="h-4 w-20" />
            </OrderBookSpreadContent>
          </OrderBookSpread>
          <div className="grid grid-cols-2">
            <OrderBookTable type="bids">
              {Array.from({ length: 10 }).map((_, index) => (
                <OrderBookTableSkeleton key={index} type="bids" />
              ))}
            </OrderBookTable>
            <OrderBookTable type="asks">
              {Array.from({ length: 10 }).map((_, index) => (
                <OrderBookTableSkeleton key={index} type="asks" />
              ))}
            </OrderBookTable>
          </div>
          <div className="flex items-center gap-x-4 mt-4 px-2">
            <div>
              <Toggle
                aria-label="Toggle time travel"
                size="sm"
                variant="outline"
                disabled={true}
              >
                <HistoryIcon />
                Time Travel
              </Toggle>
            </div>
            <CustomSlider
              value={[0]}
              max={0}
              step={1}
              disabled={true}
              thumbTooltipContent=""
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="px-0">
        <OrderBook bookPresent={bookPresent} symbol={symbol} token={token} />
      </CardContent>
    </Card>
  );
}
