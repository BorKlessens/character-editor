"use client";

import { AnimatePresence, motion } from "framer-motion";

interface VariantSwitcherProps {
  /** Label of the active category, e.g. "Head". */
  categoryLabel: string;
  /** Variant id shown in the middle, e.g. "HEAD_03". */
  variantId: string;
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const roundButton =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-duo-gray-soft bg-white text-2xl font-black text-duo-ink shadow-[0_4px_0_0_var(--color-duo-gray-soft)] transition-colors hover:border-duo-green hover:text-duo-green active:translate-y-0.5 active:shadow-none";

export default function VariantSwitcher({
  categoryLabel,
  variantId,
  current,
  total,
  onPrev,
  onNext,
}: VariantSwitcherProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <motion.button
        type="button"
        onClick={onPrev}
        whileTap={{ scale: 0.92 }}
        aria-label={`Previous ${categoryLabel} variant`}
        className={roundButton}
      >
        <span aria-hidden="true">←</span>
      </motion.button>

      <div className="flex min-w-0 flex-1 flex-col items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={variantId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="truncate text-lg font-black tracking-wide text-duo-ink"
            aria-live="polite"
          >
            {variantId}
          </motion.span>
        </AnimatePresence>
        <span className="mt-0.5 text-xs font-bold text-duo-gray">
          {current + 1} / {total}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={onNext}
        whileTap={{ scale: 0.92 }}
        aria-label={`Next ${categoryLabel} variant`}
        className={roundButton}
      >
        <span aria-hidden="true">→</span>
      </motion.button>
    </div>
  );
}
