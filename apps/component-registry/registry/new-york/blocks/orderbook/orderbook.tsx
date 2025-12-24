'use client';

import {
  OrderBookSpread,
  OrderBookSpreadContent,
} from '@/registry/new-york/blocks/orderbook/orderbook-spread';
import {
  OrderBookTable,
  OrderBookTableRow,
} from '@/registry/new-york/blocks/orderbook/orderbook-table';
import { Card, CardContent } from '@/registry/new-york/ui/card';

const bookData = {
  asks: [
    { price: 87370.9, qty: 0.02130603, total: 0.02130603 },
    { price: 87372.6, qty: 0.000051, total: 0.02135703 },
    { price: 87376.1, qty: 0.000051, total: 0.02140803 },
    { price: 87379.6, qty: 0.000051, total: 0.02145903 },
    { price: 87380.9, qty: 0.00747, total: 0.02892903 },
    { price: 87383.1, qty: 0.000051, total: 0.02898003 },
    { price: 87384.0, qty: 0.195427, total: 0.22440703 },
    { price: 87384.1, qty: 1.71656007, total: 1.9409671 },
    { price: 87386.5, qty: 0.13724807, total: 2.07821517 },
    { price: 87386.6, qty: 0.000051, total: 2.07826617 },
  ],
  bids: [
    { price: 87370.8, qty: 2.73224858, total: 2.73224858 },
    { price: 87370.7, qty: 0.003, total: 2.73524858 },
    { price: 87369.7, qty: 0.02229, total: 2.75753858 },
    { price: 87369.6, qty: 0.567288, total: 3.32482658 },
    { price: 87369.2, qty: 0.000051, total: 3.32487758 },
    { price: 87369.0, qty: 0.114448, total: 3.43932558 },
    { price: 87368.6, qty: 0.02965, total: 3.46897558 },
    { price: 87368.5, qty: 1.71686499, total: 5.18584057 },
    { price: 87367.9, qty: 0.11444907, total: 5.30028964 },
    { price: 87365.7, qty: 0.000051, total: 5.30034064 },
  ],
};

export function OrderBook() {
  const lowestAsk = bookData.asks[0].price;
  const highestBid = bookData.bids[0].price;
  const spread = lowestAsk - highestBid;
  const relativeSpread = (spread / lowestAsk) * 100;

  return (
    <Card>
      <CardContent className="px-0">
        <OrderBookSpread>
          <OrderBookSpreadContent>
            <span className="font-normal">Spread:</span> {spread.toFixed(1)} (
            {relativeSpread.toFixed(4)}%)
          </OrderBookSpreadContent>
        </OrderBookSpread>
        <div className="grid grid-cols-2">
          <OrderBookTable type="bids">
            {bookData.bids.map((bid, index) => (
              <OrderBookTableRow
                key={index}
                row={bid}
                type="bids"
                maxTotal={bookData.bids[bookData.bids.length - 1].total}
              />
            ))}
          </OrderBookTable>
          <OrderBookTable type="asks">
            {bookData.asks.map((ask, index) => (
              <OrderBookTableRow
                key={index}
                row={ask}
                type="asks"
                maxTotal={bookData.asks[bookData.asks.length - 1].total}
              />
            ))}
          </OrderBookTable>
        </div>
      </CardContent>
    </Card>
  );
}
