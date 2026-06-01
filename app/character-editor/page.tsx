"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AvatarPreview from "@/components/AvatarPreview";
import CategoryTabs from "@/components/CategoryTabs";
import VariantSwitcher from "@/components/VariantSwitcher";
import CharacterPicker from "@/components/CharacterPicker";
import EditorHeader from "@/components/EditorHeader";
import EditorFooter from "@/components/EditorFooter";
import {
  CHARACTERS,
  PART_CATEGORY_MAP,
  getDefaultSelection,
  type AvatarSelection,
  type PartKey,
} from "@/lib/avatarData";

const PANEL_ID = "editor-panel";

export default function CharacterEditorPage() {
  const [selection, setSelection] = useState<AvatarSelection>(getDefaultSelection);
  const [activeCategory, setActiveCategory] = useState<PartKey>("head");
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const category = PART_CATEGORY_MAP[activeCategory];
  const optionIndex = selection.parts[activeCategory];
  const option = category.options[optionIndex];

  const changeVariant = useCallback(
    (delta: number) => {
      setSelection((prev) => {
        const cat = PART_CATEGORY_MAP[activeCategory];
        const total = cat.options.length;
        const next = (prev.parts[activeCategory] + delta + total) % total;
        return {
          ...prev,
          parts: { ...prev.parts, [activeCategory]: next },
        };
      });
    },
    [activeCategory]
  );

  const setCharacter = useCallback((index: number) => {
    setSelection((prev) => ({ ...prev, character: index }));
  }, []);

  const handleReset = useCallback(() => {
    setSelection(getDefaultSelection());
    setActiveCategory("head");
    setJustSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setJustSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setJustSaved(false), 2200);
  }, []);

  const handleExport = useCallback(() => {
    const payload = {
      version: 2,
      createdAt: new Date().toISOString(),
      character: CHARACTERS[selection.character].slug,
      parts: Object.fromEntries(
        Object.entries(selection.parts).map(([key, index]) => [
          key,
          PART_CATEGORY_MAP[key as PartKey].options[index].id,
        ])
      ),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "character.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [selection]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8">
      <EditorHeader onExport={handleExport} />

      <div className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        {/* Avatar canvas */}
        <section
          aria-label="Avatar preview"
          className="flex items-center justify-center rounded-card bg-canvas p-6 ring-1 ring-black/5 lg:sticky lg:top-8 lg:min-h-[28rem]"
        >
          <AvatarPreview selection={selection} />
        </section>

        {/* Controls */}
        <section className="flex flex-col gap-6 rounded-card bg-white p-6 ring-1 ring-black/5">
          <div>
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-duo-gray">
              Character
            </h2>
            <CharacterPicker
              selected={selection.character}
              onSelect={setCharacter}
            />
          </div>

          <div className="h-px bg-duo-gray-soft" />

          <CategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
            panelId={PANEL_ID}
          />

          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
          >
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-duo-gray">
              {category.label} style
            </h2>
            <VariantSwitcher
              categoryLabel={category.label}
              variantId={option.id}
              current={optionIndex}
              total={category.options.length}
              onPrev={() => changeVariant(-1)}
              onNext={() => changeVariant(1)}
            />
          </div>

          <div className="mt-auto pt-2">
            <EditorFooter
              onReset={handleReset}
              onSave={handleSave}
              justSaved={justSaved}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
