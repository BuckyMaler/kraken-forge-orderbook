'use client';

import { format } from 'date-fns';
import { HistoryIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderBookSpread } from '@/app/orderbook/components/orderbook-spread';
import { OrderBookTable } from '@/app/orderbook/components/orderbook-table';
import { CustomSlider } from '@/components/custom-slider';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import {
  selectOrderBookBySymbol,
  subscribeOrderBook,
  unsubscribeOrderBook,
} from '@/lib/features/orderbook/orderbook-slice';
import { type BookData } from '@/lib/features/orderbook/orderbook-slice';
import { DEFAULT_TOKEN, TOKENS } from '@/lib/features/tokens/tokens';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectWebSocketStatus } from '@/lib/websocket/websocket-slice';

const MAX_HISTORY_LENGTH = 500;

export function OrderBook() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || DEFAULT_TOKEN.symbol;
  const prevSymbolRef = useRef<string>(symbol);
  const token = TOKENS.find((token) => token.symbol === symbol);
  const dispatch = useAppDispatch();
  const websocketStatus = useAppSelector(selectWebSocketStatus);
  const bookPresent = useAppSelector((state) =>
    selectOrderBookBySymbol(state, symbol),
  );
  const [timeTravelEnabled, setTimeTravelEnabled] = useState(false);
  const [bookHistory, setBookHistory] = useState<Array<BookData>>([]);
  const [bookHistoryIndex, setBookHistoryIndex] = useState(-1);
  const bookData = timeTravelEnabled
    ? bookHistory[bookHistoryIndex]
    : bookPresent;

  const { spread, relativeSpread } = useMemo(() => {
    if (bookData && bookData.asks.length > 0 && bookData.bids.length > 0) {
      const lowestAsk = bookData.asks[0].price;
      const highestBid = bookData.bids[0].price;
      const spread = lowestAsk - highestBid;
      const relativeSpread = (spread / lowestAsk) * 100;
      return { spread, relativeSpread };
    }
    return { spread: null, relativeSpread: null };
  }, [bookData]);

  useEffect(() => {
    if (websocketStatus !== 'open' || !token) {
      return;
    }

    const prevSymbol = prevSymbolRef.current;
    if (prevSymbol !== symbol) {
      dispatch(unsubscribeOrderBook({ symbol: prevSymbol }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeTravelEnabled(false);
      setBookHistory([]);
      setBookHistoryIndex(-1);
    }

    dispatch(subscribeOrderBook({ symbol }));
    prevSymbolRef.current = symbol;

    return () => {
      dispatch(unsubscribeOrderBook({ symbol }));
    };
  }, [websocketStatus, token, symbol, dispatch]);

  useEffect(() => {
    if (!timeTravelEnabled && bookPresent?.snapshotReceived) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookHistory((prev) => {
        const next = [...prev, bookPresent];
        if (next.length > MAX_HISTORY_LENGTH) {
          next.shift();
        }
        return next;
      });
      setBookHistoryIndex((prev) =>
        prev < MAX_HISTORY_LENGTH - 1 ? prev + 1 : prev,
      );
    }
  }, [timeTravelEnabled, bookPresent]);

  const handleTimeTravelToggle = () => {
    setTimeTravelEnabled((prev) => !prev);
    if (timeTravelEnabled) {
      setBookHistory([]);
      setBookHistoryIndex(-1);
    }
  };

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
        <div className="flex items-center gap-x-4 mt-4 px-2">
          <div>
            <Toggle
              aria-label="Toggle time travel"
              size="sm"
              variant="outline"
              disabled={bookData?.snapshotReceived !== true}
              onClick={() => handleTimeTravelToggle()}
            >
              <HistoryIcon />
              Time Travel
            </Toggle>
          </div>
          <CustomSlider
            value={[bookHistoryIndex]}
            max={bookHistory.length - 1}
            step={1}
            disabled={!timeTravelEnabled}
            thumbTooltipContent={
              bookData?.timestamp
                ? format(bookData.timestamp, 'PP, HH:mm:ss.SSS a')
                : ''
            }
            onValueChange={(value) => setBookHistoryIndex(value[0])}
          />
        </div>
      </CardContent>
    </Card>
  );
}
