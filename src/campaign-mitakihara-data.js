/**
 * src/campaign-mitakihara-data.js — Declarative Multi-Chapter Campaign Data (v0.3)
 * Defines Chapter I (Loop 100 Walpurgisnacht), Chapter II (Law of Cycles),
 * and Chapter III (Rebellion Isolation Surgery) with deterministic verdict bounds.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16 } from "./core.js";
import {
  createStalk,
  identityOperator,
  computeLoopWeightQ16,
} from "./sheaf-kernel.js";

export const CAMPAIGN_CHAPTERS = [
  {
    id: "chapter-1-walpurgisnacht",
    shortLabel: "Ch. I: Loop 100",
    title: "Chapter I: Mitakihara Loop 100 — Walpurgisnacht Convergence",
    description:
      "Survive 1,800 ticks (30s) of high-curvature despair pulses without any node hitting catastrophic singularity (D >= 50.0).",
    loops: 100,
    targetTicks: 1800,
    entropyCeilingQ16: toQ16(250.0),
    autoRebellion: false,
    labyrinth: {
      name: "Walpurgisnacht Supercell Barrier",
      curvatureKQ16: toQ16(2.5),
      labRadiusQ16: toQ16(500.0),
      maxHopeQ16: toQ16(15.0),
      maxPurityQ16: Q_ONE,
      alphaQ16: toQ16(0.6),
      betaQ16: toQ16(1.0),
      gammaQ16: toQ16(1.0),
      dBreakQ16: toQ16(10.0),
    },
  },
  {
    id: "chapter-2-law-of-cycles",
    shortLabel: "Ch. II: Law of Cycles",
    title: "Chapter II: Global Sheafification — The Law of Cycles",
    description:
      "Multiple nodes start near D_break. Use Φ_LoC sheafification to discharge despair cleanly while keeping total entropy under 180.0.",
    loops: 100,
    targetTicks: 2400,
    entropyCeilingQ16: toQ16(180.0),
    autoRebellion: false,
    labyrinth: {
      name: "Kriemhild Horizon Boundary",
      curvatureKQ16: toQ16(3.2),
      labRadiusQ16: toQ16(500.0),
      maxHopeQ16: toQ16(18.0),
      maxPurityQ16: Q_ONE,
      alphaQ16: toQ16(0.85),
      betaQ16: toQ16(1.2),
      gammaQ16: toQ16(1.1),
      dBreakQ16: toQ16(10.0),
    },
  },
  {
    id: "chapter-3-rebellion-edge-case",
    shortLabel: "Ch. III: Rebellion (A7.2)",
    title: "Chapter III: Universal Edge Case — Isolation Field & Horizon Inversion",
    description:
      "Incubator Isolation Field severs restriction maps. Maintain metastable twisted bundle equilibrium (H¹ != 0) for 2,000 ticks.",
    loops: 100,
    targetTicks: 2000,
    entropyCeilingQ16: toQ16(300.0),
    autoRebellion: true,
    labyrinth: {
      name: "Homulilly Inverted Barrier",
      curvatureKQ16: toQ16(3.8),
      labRadiusQ16: toQ16(500.0),
      maxHopeQ16: toQ16(20.0),
      maxPurityQ16: Q_ONE,
      alphaQ16: toQ16(0.75),
      betaQ16: toQ16(1.1),
      gammaQ16: toQ16(1.2),
      dBreakQ16: toQ16(10.0),
    },
  },
];

export function buildMitakiharaCampaignState(chapterId = "chapter-1-walpurgisnacht") {
  const chapter =
    CAMPAIGN_CHAPTERS.find((c) => c.id === chapterId) || CAMPAIGN_CHAPTERS[0];

  const id = identityOperator();
  const weightLoop = computeLoopWeightQ16(chapter.loops);
  const karmicScale = 1.0 + Math.log(Math.max(1, chapter.loops));

  const nodes = [
    { id: "madoka", label: "Madoka Kaname (Focal Anchor)", role: "focal_anchor" },
    { id: "homura", label: "Homura Akemi (Loop Carrier)", role: "holonomy_carrier" },
    { id: "sayaka", label: "Sayaka Miki (Gradient Node)", role: "gradient_node" },
    { id: "mami", label: "Mami Tomoe (Stability Pillar)", role: "stability_pillar" },
    { id: "kyoko", label: "Kyoko Sakura (Damping Node)", role: "damping_node" },
    { id: "kyubey", label: "Kyubey (Entropy Sink)", role: "entropy_sink" },
  ];

  // Chapter II starts with elevated despair across Sayaka and Kyoko
  const isCh2 = chapter.id === "chapter-2-law-of-cycles";
  const isCh3 = chapter.id === "chapter-3-rebellion-edge-case";

  const stalks = [
    createStalk(toQ16(5.0 * karmicScale), toQ16(0.5), toQ16(0.95), toQ16(0.0)),
    createStalk(toQ16(4.0), toQ16(isCh3 ? 14.5 : 6.5), toQ16(isCh3 ? 0.1 : 0.6), toQ16(0.0)),
    createStalk(toQ16(3.0), toQ16(isCh2 ? 11.2 : 9.8), toQ16(0.15), toQ16(0.0)),
    createStalk(toQ16(3.5), toQ16(isCh2 ? 8.5 : 2.0), toQ16(0.85), toQ16(0.0)),
    createStalk(toQ16(3.2), toQ16(isCh2 ? 10.4 : 3.0), toQ16(0.80), toQ16(0.0)),
    createStalk(toQ16(0.0), toQ16(0.0), Q_ONE, toQ16(1.0)),
  ];

  const edges = [
    { src: 1, dst: 0, fSrc: id, fDst: id, loopWeightQ16: weightLoop, label: "Karmic Reset Loop" },
    { src: 0, dst: 2, fSrc: id, fDst: id, loopWeightQ16: Q_ONE, label: "Resonance Thread" },
    { src: 3, dst: 0, fSrc: id, fDst: id, loopWeightQ16: Q_ONE, label: "Mentorship Edge" },
    { src: 4, dst: 2, fSrc: id, fDst: id, loopWeightQ16: Q_ONE, label: "Counterweight Edge" },
    { src: 2, dst: 5, fSrc: id, fDst: id, loopWeightQ16: Q_ONE, label: "Entropy Export" },
  ];

  return {
    chapter,
    nodes,
    stalks,
    edges,
    labyrinth: chapter.labyrinth,
  };
}
