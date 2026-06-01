"use client";

import { motion } from "framer-motion";

interface EditorHeaderProps {
  onExport: () => void;
}

export default function EditorHeader({ onExport }: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-duo-green text-xl shadow-[0_4px_0_0_var(--color-duo-green-dark)]"
        >
          🎨
        </span>
        <div>
          <h1 className="text-xl font-black leading-none text-duo-ink sm:text-2xl">
            Character Editor
          </h1>
          <p className="mt-1 text-xs font-bold text-duo-gray sm:text-sm">
            Build your hero
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onExport}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-2xl border-2 border-duo-green-dark bg-duo-green px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_0_var(--color-duo-green-dark)] transition-colors active:translate-y-0.5 active:shadow-none"
      >
        <span aria-hidden="true">⬆️</span>
        <span className="hidden sm:inline">Export</span>
      </motion.button>
    </header>
  );
}
