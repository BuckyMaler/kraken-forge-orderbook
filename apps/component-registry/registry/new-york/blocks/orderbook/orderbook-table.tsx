interface OrderBookTableProps {
  readonly children: React.ReactNode;
  type: OrderBookTableRowProps['type'];
}

export function OrderBookTable({ children, type }: OrderBookTableProps) {
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
      <div>{children}</div>
    </div>
  );
}

export interface OrderBookTableRowProps {
  row: { price: number | string; qty: number | string; total: number | string };
  type: 'bids' | 'asks';
  maxTotal: number | string;
}

export function OrderBookTableRow({
  row,
  type,
  maxTotal,
}: OrderBookTableRowProps) {
  return (
    <div className="relative grid grid-cols-3 border-b border-transparent [&_div]:p-2 [&_div]:text-right [&_div]:text-xs [&_div]:font-medium">
      {type === 'bids' ? (
        <>
          <div>{row.total}</div>
          <div>{row.qty}</div>
          <div className="text-green-700">{row.price}</div>
          <div
            className="absolute left-0 top-0 size-full origin-right bg-green-700 opacity-25"
            style={{
              transform: `scaleX(${Number(row.total) / Number(maxTotal)})`,
            }}
          ></div>
        </>
      ) : (
        <>
          <div className="text-red-700">{row.price}</div>
          <div>{row.qty}</div>
          <div>{row.total}</div>
          <div
            className="absolute left-0 top-0 size-full origin-left bg-red-700 opacity-25"
            style={{
              transform: `scaleX(${Number(row.total) / Number(maxTotal)})`,
            }}
          ></div>
        </>
      )}
    </div>
  );
}
