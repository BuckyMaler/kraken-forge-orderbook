// The shadcn/ui slider component does not support a tooltip above
// the slider thumb out of the box. This custom slider component
// is a copy of the shadcn/ui slider with the minial changes needed
// to display a tooltip above the slider thumb.

'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

function CustomSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbTooltipContent,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbTooltipContent: string;
}) {
  const [open, setOpen] = React.useState(false);
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        // Displays a tooltip above the slider thumb.
        <Tooltip key={index} open={props.disabled ? false : open}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              // In addition to showing the tooltip on hover/focus,
              // show it when the slider thumb is being dragged.
              onPointerEnter={() => setOpen(true)}
              onPointerLeave={() => setOpen(false)}
              onPointerDown={() => setOpen(true)}
              onPointerUp={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            />
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            {thumbTooltipContent}
          </TooltipContent>
        </Tooltip>
      ))}
    </SliderPrimitive.Root>
  );
}

export { CustomSlider };
