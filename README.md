# Character Editor

A playful, Duolingo-style character editor where you build a hero by mixing and matching body parts. Pick a head, body, arms, and legs — each from any of six characters — then tweak styles and poses. The preview updates live as you go.

The UI is designed to feel simple and friendly: category tabs, arrow buttons to cycle variants, an XP badge on save, and a one-click JSON export.

**Live demo (Vercel):** [INSERT VERCEL LINK]

This project is deployed on [Vercel](https://vercel.com). Replace the link above with your production URL once it’s live.

---

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (design tokens in `app/globals.css`)
- **Framer Motion** (hover, transitions, subtle avatar bounce)

Character art comes from the [Kenney Toon Characters](https://kenney.nl/assets/toon-characters-1) asset pack, stored in `public/assets/characters/`.

---

## Run locally

**Requirements:** Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/character-editor`.

Other scripts:

```bash
npm run build   # production build
npm run start   # run production build locally
npm run lint    # ESLint
```

---

## Folder structure

```
character-editor/
├── app/
│   ├── character-editor/page.tsx   # Main editor page (state + layout)
│   ├── globals.css                 # Tailwind v4 theme + global styles
│   ├── layout.tsx                  # Root layout (Nunito font, viewport sizing)
│   └── page.tsx                    # Redirects to /character-editor
├── components/
│   ├── AvatarPreview.tsx           # Layered character preview (PNG stacking)
│   ├── CategoryTabs.tsx            # Head / Body / Arms / Legs tabs
│   ├── CharacterPicker.tsx         # 6-character grid per active slot
│   ├── VariantSwitcher.tsx         # ← / → style cycling
│   ├── EditorHeader.tsx            # Title, Duo logo, Export button
│   └── EditorFooter.tsx            # XP badge, Reset, Save
├── lib/
│   └── avatarData.ts               # Characters, parts, defaults, helpers
└── public/
    ├── duo.png                     # Header mascot
    └── assets/characters/          # One folder per character skin (PNG parts)
```

Most day-to-day changes happen in `lib/avatarData.ts` (new characters or options) and `components/AvatarPreview.tsx` (how parts are positioned and layered).

---

## How it works (quick overview)

1. Choose a **category tab** (Head, Body, Arms, Legs).
2. Pick which **character** supplies that slot (e.g. Robot body + Adventurer head).
3. Cycle the **style** with the arrow buttons (expressions, front/back, leg poses, arm poses).
4. **Export** downloads a JSON file (`version: 3`) with the full mix.
5. **Save** shows a short “XP earned” confirmation (UI only — nothing is persisted yet).

---

## Things to know before you continue

**Mix-and-match per slot**  
Each body part has its own character choice (`skins` in state), not one global character. That’s what enables cross-character combos.

**Arms are tricky**  
Kenney’s `body.png` already includes resting arms. Poses like OUT and UP add a separate `arm.png` layer on top. It works, but you may see slight overlap on some mixes — that’s a limitation of the asset pack, not a bug in the layout logic.

**Responsive, no page scroll**  
The layout uses `100dvh` and flex/grid so the editor fits on one screen on mobile and desktop. The avatar scales down inside its panel rather than forcing the page to scroll.

**Adding a new character**  
Drop a folder under `public/assets/characters/<slug>/` with the same filenames as the others (`head.png`, `body.png`, `arm.png`, `leg.png`, etc.) and add an entry to `CHARACTERS` in `lib/avatarData.ts`. No component changes needed.

**Tailwind v4**  
There is no `tailwind.config.js`. Colors and radii live in the `@theme` block in `app/globals.css`.

**Images**  
The preview uses plain `<img>` tags (not `next/image`) so parts can be absolutely positioned and rotated with precise transforms.

**Next.js 16**  
This repo uses a newer Next.js than many tutorials. Check `node_modules/next/dist/docs/` if something behaves differently than you expect.

---

## Deployment

The app is set up for Vercel. Connect the repo, deploy, and paste the production URL into the live demo link at the top of this README.

---

## License

Character assets: [Kenney](https://kenney.nl) (check the pack license for your use case).  
Application code: see repository license if applicable.
