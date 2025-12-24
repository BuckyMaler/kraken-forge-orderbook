'use client';

import { format } from 'date-fns';
import { HistoryIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  OrderBookSpread,
  OrderBookSpreadContent,
} from '@/app/orderbook/components/orderbook-spread';
import {
  OrderBookTable,
  OrderBookTableRow,
} from '@/app/orderbook/components/orderbook-table';
import { CustomSlider } from '@/components/custom-slider';
import { Toggle } from '@/components/ui/toggle';
import { type BookData } from '@/lib/features/orderbook/orderbook-slice';
import { type Token } from '@/lib/features/tokens/tokens';

const MAX_HISTORY_LENGTH = 500;

interface OrderBookProps {
  bookPresent: BookData;
  symbol: string;
  token: Token;
}

export function OrderBook({ bookPresent, symbol, token }: OrderBookProps) {
  const [timeTravelEnabled, setTimeTravelEnabled] = useState(false);
  const [bookHistory, setBookHistory] = useState<Array<BookData>>([]);
  const [bookHistoryIndex, setBookHistoryIndex] = useState(-1);
  const bookData = timeTravelEnabled
    ? bookHistory[bookHistoryIndex]
    : bookPresent;

  const { spread, relativeSpread } = useMemo(() => {
    if (bookData.asks.length > 0 && bookData.bids.length > 0) {
      const lowestAsk = bookData.asks[0].price;
      const highestBid = bookData.bids[0].price;
      const spread = lowestAsk - highestBid;
      const relativeSpread = (spread / lowestAsk) * 100;
      return { spread, relativeSpread };
    }
    return { spread: null, relativeSpread: null };
  }, [bookData]);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: token.pairDecimals,
        maximumFractionDigits: token.pairDecimals,
      }),
    [token],
  );

  const formattedAsks = useMemo(
    () =>
      bookData.asks.map((ask) => ({
        price: priceFormatter.format(ask.price),
        qty: ask.qty.toFixed(token.lotDecimals),
        total: ask.total.toFixed(token.lotDecimals),
      })),
    [bookData, priceFormatter, token],
  );

  const formattedBids = useMemo(
    () =>
      bookData.bids.map((bid) => ({
        price: priceFormatter.format(bid.price),
        qty: bid.qty.toFixed(token.lotDecimals),
        total: bid.total.toFixed(token.lotDecimals),
      })),
    [bookData, priceFormatter, token],
  );

  const formattedSpread = useMemo(
    () => (spread !== null ? spread.toFixed(token.pairDecimals) : '-'),
    [spread, token],
  );

  const formattedRelativeSpread = useMemo(
    () => (relativeSpread !== null ? `${relativeSpread.toFixed(4)}%` : '-'),
    [relativeSpread],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeTravelEnabled(false);
    setBookHistory([]);
    setBookHistoryIndex(-1);
  }, [symbol]);

  useEffect(() => {
    if (!timeTravelEnabled && bookPresent.snapshotReceived) {
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

  return (
    <>
      <OrderBookSpread>
        <OrderBookSpreadContent>
          <span className="font-normal">Spread:</span> {formattedSpread} (
          {formattedRelativeSpread})
        </OrderBookSpreadContent>
      </OrderBookSpread>
      <div className="grid grid-cols-2">
        <OrderBookTable type="bids">
          {formattedBids.map((bid, index) => (
            <OrderBookTableRow
              key={index}
              row={bid}
              type="bids"
              maxTotal={formattedBids[formattedBids.length - 1].total}
            />
          ))}
        </OrderBookTable>
        <OrderBookTable type="asks">
          {formattedAsks.map((ask, index) => (
            <OrderBookTableRow
              key={index}
              row={ask}
              type="asks"
              maxTotal={formattedAsks[formattedAsks.length - 1].total}
            />
          ))}
        </OrderBookTable>
      </div>
      <div className="flex items-center gap-x-4 mt-4 px-2">
        <div>
          <Toggle
            aria-label="Toggle time travel"
            size="sm"
            variant="outline"
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
          thumbTooltipContent={format(bookData.timestamp, 'PP, HH:mm:ss.SSS a')}
          onValueChange={(value) => setBookHistoryIndex(value[0])}
        />
      </div>
    </>
  );
}
