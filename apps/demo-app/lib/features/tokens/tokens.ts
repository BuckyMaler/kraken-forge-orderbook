export interface Token {
  symbol: string;
  pairDecimals: number;
  lotDecimals: number;
  iconUrl: string;
}

export const TOKENS: Array<Token> = [
  {
    symbol: 'BTC/USD',
    pairDecimals: 1,
    lotDecimals: 8,
    iconUrl:
      'https://assets.kraken.com/marketing/web/icons-uni-webp/s_btc.webp?i=kds',
  },
  {
    symbol: 'ETH/USD',
    pairDecimals: 2,
    lotDecimals: 8,
    iconUrl:
      'https://assets.kraken.com/marketing/web/icons-uni-webp/s_eth.webp?i=kds',
  },
  {
    symbol: 'XRP/USD',
    pairDecimals: 5,
    lotDecimals: 8,
    iconUrl:
      'https://assets.kraken.com/marketing/web/icons-uni-webp/s_xrp.webp?i=kds',
  },
  {
    symbol: 'SOL/USD',
    pairDecimals: 2,
    lotDecimals: 8,
    iconUrl:
      'https://assets.kraken.com/marketing/web/icons-uni-webp/s_sol.webp?i=kds',
  },
  {
    symbol: 'TRX/USD',
    pairDecimals: 6,
    lotDecimals: 8,
    iconUrl:
      'https://assets.kraken.com/marketing/web/icons-uni-webp/s_trx.webp?i=kds',
  },
];

export const DEFAULT_TOKEN = TOKENS[0];
