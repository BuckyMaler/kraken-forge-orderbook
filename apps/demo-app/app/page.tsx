import { Suspense } from 'react';
import { OrderBookContainer } from '@/app/orderbook/components/orderbook-container';
import { SymbolSelect } from '@/app/symbol-select/components/symbol-select';

export default function Home() {
  return (
    <div className="space-y-4">
      <Suspense>
        <SymbolSelect />
        <OrderBookContainer />
      </Suspense>
    </div>
  );
}
