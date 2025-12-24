# Kraken Forge Order Book Visualizer

This is a hackathon [(Kraken Forge)](https://taikai.network/en/kraken/hackathons/kraken-forge/overview) project. The requirements were to build an order book visualizer that connects to Kraken's WebSocket API and allows time travel. In addition to that, the order book component should be reusable.

This is a Turbo powered monorepo with two Next.js apps. Refer to each app's `README.md` for details about the app and how to run it.

### Apps

| Name                                                                                                                    | Description                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Demo App](https://github.com/BuckyMaler/kraken-forge-orderbook-visualizer/tree/main/apps/demo-app)                     | An order book visualizer that connects to Kraken's WebSocket API and allows time travel                |
| [Component Registry](https://github.com/BuckyMaler/kraken-forge-orderbook-visualizer/tree/main/apps/component-registry) | A custom component registry for distributing code using [shadcn](https://ui.shadcn.com/docs/registry). |
