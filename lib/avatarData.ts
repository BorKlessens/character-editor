/**
 * Data model for the character editor, built around the
 * "Kenney – Toon Characters" asset pack.
 *
 * The pack ships 6 character "skins", each with the same set of body parts
 * (head + expressions, body front/back, a single arm, leg / legBend, hand).
 * Hair and colors are baked into the art, so instead of tinting we let the
 * user pick a skin and swap/pose the individual parts.
 *
 * Assets live in `/public/assets/characters/<slug>/<part>.png`. To add more
 * characters, drop another folder with the same file names and add an entry
 * to `CHARACTERS` below — no component changes needed.
 */

export interface CharacterSkin {
  slug: string;
  name: string;
}

export const CHARACTERS: CharacterSkin[] = [
  { slug: "male-adventurer", name: "Adventurer" },
  { slug: "female-adventurer", name: "Explorer" },
  { slug: "male-person", name: "Casual Guy" },
  { slug: "female-person", name: "Casual Girl" },
  { slug: "robot", name: "Robot" },
  { slug: "zombie", name: "Zombie" },
];

export type PartKey = "head" | "body" | "arms" | "legs";

export interface PartOption {
  /** Label shown in the variant switcher, e.g. "SHOCK". */
  id: string;
}

export interface PartCategory {
  key: PartKey;
  label: string;
  icon: string;
  options: PartOption[];
}

export const PART_CATEGORIES: PartCategory[] = [
  {
    key: "head",
    label: "Head",
    icon: "🙂",
    options: [{ id: "NORMAL" }, { id: "FOCUS" }, { id: "SHOCK" }],
  },
  {
    key: "body",
    label: "Body",
    icon: "👕",
    options: [{ id: "FRONT" }, { id: "BACK" }],
  },
  {
    // Arm pose. "REST" uses the arms baked into the body art; the others
    // overlay an `arm.png` per side at the given pose.
    key: "arms",
    label: "Arms",
    icon: "💪",
    options: [{ id: "REST" }, { id: "DOWN" }, { id: "OUT" }, { id: "UP" }],
  },
  {
    key: "legs",
    label: "Legs",
    icon: "🦵",
    options: [{ id: "TOGETHER" }, { id: "APART" }, { id: "BEND" }],
  },
];

export const PART_CATEGORY_MAP: Record<PartKey, PartCategory> =
  PART_CATEGORIES.reduce((acc, category) => {
    acc[category.key] = category;
    return acc;
  }, {} as Record<PartKey, PartCategory>);

/** The user's current choices. */
export interface AvatarSelection {
  /**
   * Selected character (index into CHARACTERS) per slot. Each part can use
   * a different character, so you can mix-and-match e.g. a Robot body with
   * an Adventurer head.
   */
  skins: Record<PartKey, number>;
  /** Selected option index per part category. */
  parts: Record<PartKey, number>;
}

function zeroPerPart(): Record<PartKey, number> {
  return PART_CATEGORIES.reduce((acc, category) => {
    acc[category.key] = 0;
    return acc;
  }, {} as Record<PartKey, number>);
}

export function getDefaultSelection(): AvatarSelection {
  return {
    skins: zeroPerPart(),
    parts: zeroPerPart(),
  };
}

/** Resolve the active option id for a part, e.g. "SHOCK". */
export function getOptionId(selection: AvatarSelection, key: PartKey): string {
  return PART_CATEGORY_MAP[key].options[selection.parts[key]].id;
}

/** Asset folder slug for the character used in a given slot. */
export function getSlotSlug(selection: AvatarSelection, key: PartKey): string {
  return CHARACTERS[selection.skins[key]].slug;
}

export const XP_REWARD = 50;
