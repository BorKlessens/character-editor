/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CHARACTERS } from "@/lib/avatarData";

interface CharacterPickerProps {
  selected: number;
  onSelect: (index: number) => void;
  /** Accessible name; defaults to "Character". */
  ariaLabel?: string;
}

export default function CharacterPicker({
  selected,
  onSelect,
  ariaLabel = "Character",
}: CharacterPickerProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectAt(index: number) {
    onSelect(index);
    refs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const count = CHARACTERS.length;
    let next = selected;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (selected + 1) % count;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (selected - 1 + count) % count;
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
    selectAt(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-6 gap-1.5 sm:gap-2"
    >
      {CHARACTERS.map((character, index) => {
        const isSelected = index === selected;
        return (
          <motion.button
            key={character.slug}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={character.name}
            title={character.name}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className={[
              "flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-canvas transition-shadow",
              // Use an inset ring so the selected state stays inside the cell
              // and every thumbnail keeps the exact same outer size.
              isSelected
                ? "ring-[3px] ring-inset ring-duo-green"
                : "ring-2 ring-inset ring-black/10 hover:ring-black/25",
            ].join(" ")}
          >
            <img
              src={`/assets/characters/${character.slug}/head.png`}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="h-[78%] w-[78%] object-contain"
            />
          </motion.button>
        );
      })}
    </div>
  );
}
