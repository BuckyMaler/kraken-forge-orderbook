import * as React from 'react';
// import { OpenInV0Button } from '@/components/open-in-v0-button';
import { OrderBook } from '@/registry/new-york/blocks/orderbook/orderbook';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Kraken Forge Component Registry
        </h1>
        <p className="text-muted-foreground">
          A component registry for distributing code using shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A sleek order book component
            </h2>
            {/* <OpenInV0Button name="orderbook" className="w-fit" /> */}
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <div className="w-full max-w-2xl">
              <OrderBook />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
