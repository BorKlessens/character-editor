"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { PART_CATEGORIES, type PartKey } from "@/lib/avatarData";

interface CategoryTabsProps {
  active: PartKey;
  onChange: (key: PartKey) => void;
  /** id of the panel these tabs control, for aria-controls wiring. */
  panelId: string;
}

const CATEGORIES = PART_CATEGORIES;

export default function CategoryTabs({
  active,
  onChange,
  panelId,
}: CategoryTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const key = CATEGORIES[index].key;
    onChange(key);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const count = CATEGORIES.length;
    const current = CATEGORIES.findIndex((c) => c.key === active);
    let next = current;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (current + 1) % count;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (current - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusTab(next);
  }

  return (
    <div
      role="tablist"
      aria-label="Character part categories"
      onKeyDown={handleKeyDown}
      className="no-scrollbar flex gap-2 overflow-x-auto pb-1"
    >
      {CATEGORIES.map((category, index) => {
        const isActive = category.key === active;
        return (
          <motion.button
            key={category.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${category.key}`}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(category.key)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={[
              "flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-extrabold transition-colors",
              isActive
                ? "border-duo-green-dark bg-duo-green text-white shadow-[0_4px_0_0_var(--color-duo-green-dark)]"
                : "border-duo-gray-soft bg-white text-duo-gray hover:border-duo-gray hover:text-duo-ink",
            ].join(" ")}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {category.icon}
            </span>
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}
