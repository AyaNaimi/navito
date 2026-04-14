import * as React from "react";
import { cn, hapticFeedback } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, startIcon, endIcon, onEndIconClick, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            data-slot="input"
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "flex h-14 w-full min-w-0 rounded-2xl border px-4 py-3 text-[15px] font-medium",
              "bg-secondary border-border text-foreground placeholder:text-muted-foreground",
              "transition-all duration-200 ease-out",
              "outline-none",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:bg-background",
              "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
              startIcon && "pl-12",
              endIcon && "pr-12",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
          {endIcon && (
            <button
              type="button"
              onClick={onEndIconClick}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground",
                "transition-colors hover:text-foreground",
                onEndIconClick && "cursor-pointer active:scale-90"
              )}
            >
              {endIcon}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-[11px] font-bold text-destructive flex items-center gap-1.5 ml-1">
            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
