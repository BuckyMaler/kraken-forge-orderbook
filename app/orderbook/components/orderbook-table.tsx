import {
  OrderBookTableRow,
  OrderBookTableRowProps,
} from '@/app/orderbook/components/orderbook-table-row';
import { OrderBookTableSkeleton } from '@/app/orderbook/components/orderbook-table-skeleton';

interface OrderBookTableProps {
  rows: Array<OrderBookTableRowProps['row']>;
  type: OrderBookTableRowProps['type'];
  snapshotReceived: boolean;
}

export function OrderBookTable({
  rows,
  type,
  snapshotReceived,
}: OrderBookTableProps) {
  return (
    <div>
      <div>
        <div className="grid grid-cols-3 [&_div]:flex [&_div]:items-center [&_div]:justify-end [&_div]:h-10 [&_div]:px-2 [&_div]:text-xs [&_div]:font-medium [&_div]:uppercase [&_div]:text-gray-500">
          {type === 'bids' ? (
            <>
              <div>Total</div>
              <div>Quantity</div>
              <div>Price</div>
            </>
          ) : (
            <>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </>
          )}
        </div>
      </div>
      <div>
        {!snapshotReceived
          ? Array.from({ length: 10 }).map((_, index) => (
              <OrderBookTableSkeleton key={index} type={type} />
            ))
          : rows.map((row, index) => (
              <OrderBookTableRow
                key={index}
                row={row}
                type={type}
                maxTotal={rows[rows.length - 1].total}
              />
            ))}
      </div>
    </div>
  );
}
