import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FloatingLabelInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  trailing?: ReactNode;
};

export const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ label, error, trailing, className, id, name, ...props }, ref) => {
  const inputId = id ?? name;

  return (
    <div>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer w-full rounded-xl border px-4 pt-5 pb-2 text-base text-neutral-900 placeholder-transparent focus:outline-none",
            trailing && "pr-11",
            error
              ? "border-accent-red focus:border-accent-red"
              : "border-neutral-300 focus:border-primary-100",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 transition-all peer-focus:top-3 peer-focus:text-xs peer-focus:text-neutral-500 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-neutral-500"
        >
          {label}
        </label>
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-accent-red">{error}</p>}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";
