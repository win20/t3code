import type { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

import { cn } from "~/lib/utils";

export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetVariant = "default" | "inset";

function resolveClassName<State>(
  baseClassName: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

export function getSheetBackdropClassName(options?: {
  animated?: boolean;
  className?: SheetPrimitive.Backdrop.Props["className"];
}) {
  return resolveClassName<SheetPrimitive.Backdrop.State>(
    cn(
      "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm",
      options?.animated !== false &&
        "transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
    ),
    options?.className,
  );
}

export function getSheetViewportClassName(options?: {
  className?: SheetPrimitive.Viewport.Props["className"];
  side?: SheetSide;
  variant?: SheetVariant;
}) {
  const side = options?.side ?? "right";
  const variant = options?.variant ?? "default";

  return resolveClassName<SheetPrimitive.Viewport.State>(
    cn(
      "fixed inset-0 z-50 grid",
      side === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
      side === "top" && "grid grid-rows-[auto_1fr] pb-12",
      side === "left" && "flex justify-start",
      side === "right" && "flex justify-end",
      variant === "inset" && "sm:p-4",
    ),
    options?.className,
  );
}

export function getSheetPopupClassName(options?: {
  animated?: boolean;
  className?: SheetPrimitive.Popup.Props["className"];
  side?: SheetSide;
  variant?: SheetVariant;
}) {
  const animated = options?.animated !== false;
  const side = options?.side ?? "right";
  const variant = options?.variant ?? "default";

  return resolveClassName<SheetPrimitive.Popup.State>(
    cn(
      "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] max-sm:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      animated &&
        "transition-[opacity,translate] duration-200 ease-in-out will-change-transform data-ending-style:opacity-0 data-starting-style:opacity-0",
      side === "bottom" &&
        cn(
          "row-start-2 border-t",
          animated && "data-ending-style:translate-y-8 data-starting-style:translate-y-8",
        ),
      side === "top" &&
        cn(
          "border-b",
          animated && "data-ending-style:-translate-y-8 data-starting-style:-translate-y-8",
        ),
      side === "left" &&
        cn(
          "w-[calc(100%-(--spacing(12)))] max-w-md border-e",
          animated && "data-ending-style:-translate-x-8 data-starting-style:-translate-x-8",
        ),
      side === "right" &&
        cn(
          "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s",
          animated && "data-ending-style:translate-x-8 data-starting-style:translate-x-8",
        ),
      variant === "inset" &&
        "before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
    ),
    options?.className,
  );
}
