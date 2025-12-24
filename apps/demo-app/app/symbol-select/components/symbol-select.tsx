'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_TOKEN, TOKENS } from '@/lib/features/tokens/tokens';

export function SymbolSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSymbol = searchParams.get('symbol') || DEFAULT_TOKEN.symbol;

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('symbol', value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <Select value={selectedSymbol} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TOKENS.map(({ symbol, iconUrl }) => {
          const [ticker, market] = symbol.split('/');
          return (
            <SelectItem key={symbol} value={symbol}>
              <Avatar className="size-5">
                <AvatarImage src={iconUrl} alt={`${ticker} icon`} />
                <AvatarFallback>{ticker.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-medium">
                <span>{ticker}</span>
                <span className="text-gray-600">/{market}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
