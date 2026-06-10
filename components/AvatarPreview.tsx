/* eslint-disable @next/next/no-img-element */
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  getOptionId,
  getSlotSlug,
  type AvatarSelection,
} from "@/lib/avatarData";

/** Internal coordinate space; the whole stage is scaled to fit its container. */
const STAGE_W = 300;
const STAGE_H = 400;

interface Layer {
  key: string;
  src: string;
  /** Center-x / anchor-y target in stage units. */
  x: number;
  y: number;
  /**
   * Size in stage units. Provide exactly one of width/height; the other is
   * `auto` so the art keeps its aspect ratio. The body is sized by height so
   * the torso length (and the leg attach point) stays consistent across the
   * differently-proportioned characters.
   */
  width?: number;
  height?: number;
  /** CSS transform applied after positioning (rotation / mirroring). */
  transform: string;
  transformOrigin: string;
  zIndex: number;
}

const LEG_LAYOUT: Record<string, { file: string; width: number; dx: number }> = {
  TOGETHER: { file: "leg.png", width: 40, dx: 24 },
  APART: { file: "leg.png", width: 40, dx: 36 },
  BEND: { file: "legBend.png", width: 52, dx: 28 },
};

/**
 * Arm pose overlays. Each entry lists the arms to draw (one per side) and the
 * rotation around the shoulder. "REST" draws nothing extra — the body art
 * already contains resting arms.
 */
const ARM_POSES: Record<string, Array<{ side: -1 | 1; rot: number }>> = {
  REST: [],
  DOWN: [
    { side: -1, rot: 6 },
    { side: 1, rot: 6 },
  ],
  OUT: [
    { side: -1, rot: -52 },
    { side: 1, rot: -52 },
  ],
  UP: [
    { side: -1, rot: -120 },
    { side: 1, rot: -120 },
  ],
};

function buildLayers(selection: AvatarSelection): Layer[] {
  // Each slot pulls art from its own character so head/body/arms/legs can mix.
  const headBase = `/assets/characters/${getSlotSlug(selection, "head")}`;
  const bodyBase = `/assets/characters/${getSlotSlug(selection, "body")}`;
  const armBase = `/assets/characters/${getSlotSlug(selection, "arms")}`;
  const legBase = `/assets/characters/${getSlotSlug(selection, "legs")}`;

  const facingBack = getOptionId(selection, "body") === "BACK";

  const headFile = facingBack
    ? "headBack.png"
    : ["head.png", "headFocus.png", "headShock.png"][selection.parts.head];
  const bodyFile = facingBack ? "bodyBack.png" : "body.png";

  const legId = getOptionId(selection, "legs");
  const leg = LEG_LAYOUT[legId] ?? LEG_LAYOUT.TOGETHER;

  const layers: Layer[] = [];

  // Legs (bottom layer)
  for (const side of [-1, 1] as const) {
    layers.push({
      key: `leg-${side}`,
      src: `${legBase}/${leg.file}`,
      x: 150 + side * leg.dx,
      y: 312,
      width: leg.width,
      transform: `translate(-50%, 0) scaleX(${side})`,
      transformOrigin: "50% 0%",
      zIndex: 20,
    });
  }

  // Body (already includes the resting arms + hands in the artwork).
  // Sized by height so the torso length is identical for every character.
  layers.push({
    key: "body",
    src: `${bodyBase}/${bodyFile}`,
    x: 150,
    y: 186,
    height: 132,
    transform: "translate(-50%, 0)",
    transformOrigin: "50% 0%",
    zIndex: 30,
  });

  // Arm overlay (poseable). Skipped while facing back.
  if (!facingBack) {
    const poses = ARM_POSES[getOptionId(selection, "arms")] ?? [];
    for (const { side, rot } of poses) {
      layers.push({
        key: `arm-${side}`,
        src: `${armBase}/arm.png`,
        x: 150 + side * 52,
        y: 214,
        width: 44,
        transform: `translate(-50%, 0) scaleX(${side}) rotate(${rot}deg)`,
        transformOrigin: "50% 8%",
        zIndex: 35,
      });
    }
  }

  // Head (top layer, anchored by its chin to the neckline)
  layers.push({
    key: "head",
    src: `${headBase}/${headFile}`,
    x: 150,
    y: 200,
    width: 150,
    transform: "translate(-50%, -100%)",
    transformOrigin: "50% 100%",
    zIndex: 40,
  });

  return layers;
}

export default function AvatarPreview({
  selection,
}: {
  selection: AvatarSelection;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layers = buildLayers(selection);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[340px] select-none"
      style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
      role="img"
      aria-label="Character preview"
    >
      <motion.div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {layers.map((layer) => (
          <motion.img
            key={layer.key}
            src={layer.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              position: "absolute",
              left: layer.x,
              top: layer.y,
              width: layer.width ?? "auto",
              height: layer.height ?? "auto",
              transform: layer.transform,
              transformOrigin: layer.transformOrigin,
              zIndex: layer.zIndex,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
