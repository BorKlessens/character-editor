"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XP_REWARD } from "@/lib/avatarData";

interface EditorFooterProps {
  onReset: () => void;
  onSave: () => void;
  justSaved: boolean;
}

export default function EditorFooter({
  onReset,
  onSave,
  justSaved,
}: EditorFooterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* XP badge */}
      <div className="flex justify-center">
        <motion.div
          animate={justSaved ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border-2 border-duo-yellow-dark bg-duo-yellow px-4 py-1.5 text-sm font-extrabold text-duo-ink shadow-[0_3px_0_0_var(--color-duo-yellow-dark)]"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-duo-yellow-dark text-[11px] text-white"
          >
            ★
          </span>
          <AnimatePresence mode="wait" initial={false}>
            {justSaved ? (
              <motion.span
                key="earned"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                +{XP_REWARD} XP verdiend! 🎉
              </motion.span>
            ) : (
              <motion.span
                key="prompt"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                +{XP_REWARD} XP bij opslaan!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          type="button"
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          className="flex-1 rounded-2xl border-2 border-duo-gray-soft bg-white px-5 py-3.5 text-base font-extrabold text-duo-ink shadow-[0_4px_0_0_var(--color-duo-gray-soft)] transition-colors hover:border-duo-gray active:translate-y-0.5 active:shadow-none"
        >
          Reset
        </motion.button>
        <motion.button
          type="button"
          onClick={onSave}
          whileTap={{ scale: 0.97 }}
          className="flex-[1.5] rounded-2xl border-2 border-duo-green-dark bg-duo-green px-5 py-3.5 text-base font-extrabold uppercase tracking-wide text-white shadow-[0_4px_0_0_var(--color-duo-green-dark)] transition-colors active:translate-y-0.5 active:shadow-none"
        >
          {justSaved ? "Opgeslagen!" : "Save"}
        </motion.button>
      </div>
    </div>
  );
}
