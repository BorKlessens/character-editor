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

  const setCharacterForActiveSlot = useCallback(
    (index: number) => {
      setSelection((prev) => ({
        ...prev,
        skins: { ...prev.skins, [activeCategory]: index },
      }));
    },
    [activeCategory]
  );

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
      version: 3,
      createdAt: new Date().toISOString(),
      slots: Object.fromEntries(
        Object.keys(PART_CATEGORY_MAP).map((key) => {
          const k = key as PartKey;
          const category = PART_CATEGORY_MAP[k];
          return [
            k,
            {
              character: CHARACTERS[selection.skins[k]].slug,
              option: category.options[selection.parts[k]].id,
            },
          ];
        })
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
    <main className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3 overflow-hidden px-4 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <EditorHeader onExport={handleExport} />

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 sm:gap-4 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1 lg:gap-6">
        {/* Avatar canvas */}
        <section
          aria-label="Avatar preview"
          className="flex min-h-0 items-center justify-center overflow-hidden rounded-card bg-canvas p-3 ring-1 ring-black/5 sm:p-4 lg:p-6"
        >
          <AvatarPreview selection={selection} />
        </section>

        {/* Controls */}
        <section className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-card bg-white p-4 ring-1 ring-black/5 sm:gap-4 sm:p-5 lg:gap-6 lg:p-6">
          <CategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
            panelId={PANEL_ID}
          />

          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto sm:gap-4 lg:gap-5"
          >
            <div>
              <h2 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-duo-gray sm:text-xs">
                {category.label} character
              </h2>
              <CharacterPicker
                selected={selection.skins[activeCategory]}
                onSelect={setCharacterForActiveSlot}
                ariaLabel={`${category.label} character`}
              />
            </div>

            <div className="h-px bg-duo-gray-soft" />

            <div>
              <h2 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-duo-gray sm:text-xs">
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
          </div>

          <EditorFooter
            onReset={handleReset}
            onSave={handleSave}
            justSaved={justSaved}
          />
        </section>
      </div>
    </main>
  );
}
