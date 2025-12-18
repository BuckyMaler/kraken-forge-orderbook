'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderBookSpread } from '@/app/orderbook/components/orderbook-spread';
import { OrderBookTable } from '@/app/orderbook/components/orderbook-table';
import { Card, CardContent } from '@/components/ui/card';
import {
  selectOrderBookBySymbol,
  selectSpreadBySymbol,
  subscribeOrderBook,
  unsubscribeOrderBook,
} from '@/lib/features/orderbook/orderbook-slice';
import { DEFAULT_TOKEN, TOKENS } from '@/lib/features/tokens/tokens';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectWebSocketStatus } from '@/lib/websocket/websocket-slice';

export function OrderBook() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || DEFAULT_TOKEN.symbol;
  const prevSymbolRef = useRef<string>(symbol);
  const token = TOKENS.find((token) => token.symbol === symbol);
  const dispatch = useAppDispatch();
  const websocketStatus = useAppSelector(selectWebSocketStatus);
  const bookData = useAppSelector((state) =>
    selectOrderBookBySymbol(state, symbol),
  );
  const { spread, relativeSpread } = useAppSelector((state) =>
    selectSpreadBySymbol(state, symbol),
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

  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: token.pairDecimals,
    maximumFractionDigits: token.pairDecimals,
  });

  const formattedAsks = (bookData?.asks ?? []).map((ask) => ({
    price: priceFormatter.format(ask.price),
    qty: ask.qty.toFixed(token.lotDecimals),
    total: ask.total.toFixed(token.lotDecimals),
  }));

  const formattedBids = (bookData?.bids ?? []).map((bid) => ({
    price: priceFormatter.format(bid.price),
    qty: bid.qty.toFixed(token.lotDecimals),
    total: bid.total.toFixed(token.lotDecimals),
  }));

  const formattedSpread =
    spread !== null ? spread.toFixed(token.pairDecimals) : '-';
  const formattedRelativeSpread =
    relativeSpread !== null ? `${relativeSpread.toFixed(4)}%` : '-';

  return (
    <Card>
      <CardContent className="px-0">
        <OrderBookSpread
          spread={formattedSpread}
          relativeSpread={formattedRelativeSpread}
          snapshotReceived={bookData?.snapshotReceived ?? false}
        />
        <div className="grid grid-cols-2">
          <OrderBookTable
            rows={formattedBids}
            type="bids"
            snapshotReceived={bookData?.snapshotReceived ?? false}
          />
          <OrderBookTable
            rows={formattedAsks}
            type="asks"
            snapshotReceived={bookData?.snapshotReceived ?? false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
