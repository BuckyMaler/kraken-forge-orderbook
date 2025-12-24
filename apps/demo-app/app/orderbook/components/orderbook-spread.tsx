import { Item, ItemTitle } from '@/components/ui/item';

interface OrderBookSpreadProps {
  readonly children: React.ReactNode;
}

export function OrderBookSpread({ children }: OrderBookSpreadProps) {
  return <Item className="justify-center p-0">{children}</Item>;
}

interface OrderBookSpreadContentProps {
  readonly children: React.ReactNode;
}

export function OrderBookSpreadContent({
  children,
}: OrderBookSpreadContentProps) {
  return <ItemTitle className="text-xs text-gray-600">{children}</ItemTitle>;
}
