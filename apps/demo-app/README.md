# Kraken Forge Demo App

[https://kraken-forge-demo-app.vercel.app](https://kraken-forge-demo-app.vercel.app)

## About

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and built with TypeScript, Redux Toolkit, shadcn/ui, Tailwind CSS, and the Kraken WebSocket API.

- 💪 TypeScript
- 🏗️ Next.js
  - Fast development builds
  - Optimized production build
- 🛠️ Redux Toolkit
  - Robust state management
  - Granular state updates
- 🎨 shadcn/ui
  - Accelerates development with pre-built components
  - Provides design consistency
- 💅 Tailwind CSS
  - Accelerates development with utility classes
  - Pairs well with shadcn/ui
- 🐙 Kraken WebSocket API

### Data Streaming

Level 2 (L2) order book data is streamed via the Kraken WebSocket API. `websocketMiddleware` is responsible for connecting/disconnecting the websocket connection and sending/receiving websocket messages. `orderbookMiddleware` is responsible for subscribing/unsubscribing to the `book` channel and handling `book` channel messages.

**`book` channel subscribe flow**

![book channel subscribe flow diagram](/apps/demo-app/public/book-channel-subscribe-flow.png)

**`orderbook` state update flow**

![orderbook state update flow diagram](/apps/demo-app/public/orderbook-state-update-flow.png)

### Performance Optimizations

- React updates triggered by websocket data are throttled to improve performance and UX

- Depth graph rendering is hardware accelerated using CSS transforms

- Skeleton loading states to improve perceived performance and UX

- Only the latest 10 asks/bids per token are cached to prevent memory bloat

- React Compiler is enabled for automatic memoization using `useMemo`, `useCallback`, and `React.memo`

## Development

### Prerequisites

- node 22.x

- pnpm 10.x

### Running the App

1. Run `pnpm install` to install all dependencies

2. Run `pnpm run dev` to start the development server

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
