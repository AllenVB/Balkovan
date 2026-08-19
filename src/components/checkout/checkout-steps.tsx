import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";

/** Tasarimdaki iki adimli ilerleme gostergesi: Adres & Kargo -> Odeme. */
const steps = [
  { number: 1, label: "Adres & Kargo" },
  { number: 2, label: "Ödeme" },
] as const;

export function CheckoutSteps({ current }: { current: 1 | 2 }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isDone = step.number < current;
        const isActive = step.number === current;

        return (
          <li key={step.number} className="flex items-center gap-2 sm:gap-4">
            {index > 0 ? (
              <span
                className={clsx(
                  "h-0.5 w-8 sm:w-16 rounded-full",
                  isDone || isActive ? "bg-primary" : "bg-outline-variant",
                )}
                aria-hidden="true"
              />
            ) : null}

            <span className="flex items-center gap-2">
              <span
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shrink-0",
                  isActive && "bg-primary text-on-primary",
                  isDone && "bg-primary-container text-on-primary-container",
                  !isActive && !isDone &&
                    "bg-surface-container-high text-on-surface-variant",
                )}
              >
                {isDone ? <Icon name="check" className="text-sm" /> : step.number}
              </span>
              <span
                aria-current={isActive ? "step" : undefined}
                className={clsx(
                  "font-label-md text-label-md hidden sm:block",
                  isActive || isDone
                    ? "text-primary font-bold"
                    : "text-on-surface-variant",
                )}
              >
                {step.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
