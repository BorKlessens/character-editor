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
      className="flex flex-wrap gap-2.5"
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
              "flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-canvas transition-shadow",
              isSelected
                ? "ring-4 ring-duo-green ring-offset-2"
                : "ring-2 ring-black/10 hover:ring-black/25",
            ].join(" ")}
          >
            <img
              src={`/assets/characters/${character.slug}/head.png`}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="h-11 w-11 object-contain"
            />
          </motion.button>
        );
      })}
    </div>
  );
}
