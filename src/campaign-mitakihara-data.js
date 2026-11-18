/**
 * src/campaign-mitakihara-data.js — Declarative Campaign Scenarios (Ledger 2 Data)
 * Defines canonical Mitakihara timeline nodes, labyrinth parameters, Law of Cycles
 * sheafification triggers, and the Rebellion Isolation Field universal edge case.
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
    title: "Chapter I: Mitakihara Loop 100 — Walpurgisnacht Convergence",
    description:
      "Accumulated karmic holonomy across 100 timeline resets concentrates potential at Focal Node 0 while despair approaches D_break.",
    loops: 100,
    dBreakQ16: toQ16(10.0),
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
    title: "Chapter II: Global Sheafification — The Law of Cycles",
    description:
      "Global sheafification functor Φ_LoC intercepts nodes reaching D_break, discharging curse load into clean entropy without Witch 2-cell collapse.",
    loops: 100,
    dBreakQ16: toQ16(10.0),
  },
  {
    id: "chapter-3-rebellion-edge-case",
    title: "Chapter III: Universal Edge Case — Isolation Field & Horizon Inversion",
    description:
      "Incubator Isolation Field severs restriction maps (σ_min -> 0+). A7.2 Tikhonov clamping (λ = 98/65536) and Z₂ orientation twist stabilize H¹ != 0.",
    loops: 100,
    dBreakQ16: toQ16(10.0),
  },
];

/**
 * Instantiate the canonical 6-node Mitakihara cellular sheaf state in Q16.16.
 */
export function buildMitakiharaCampaignState(loops = 100) {
  const id = identityOperator();
  const weightLoop = computeLoopWeightQ16(loops);
  const karmicScale = 1.0 + Math.log(Math.max(1, loops));

  const nodes = [
    { id: "madoka", label: "Madoka Kaname (Focal Anchor)", role: "focal_anchor" },
    { id: "homura", label: "Homura Akemi (Loop Carrier)", role: "holonomy_carrier" },
    { id: "sayaka", label: "Sayaka Miki (Gradient Node)", role: "gradient_node" },
    { id: "mami", label: "Mami Tomoe (Stability Pillar)", role: "stability_pillar" },
    { id: "kyoko", label: "Kyoko Sakura (Damping Node)", role: "damping_node" },
    { id: "kyubey", label: "Kyubey (Entropy Sink)", role: "entropy_sink" },
  ];

  const stalks = [
    createStalk(toQ16(5.0 * karmicScale), toQ16(0.5), toQ16(0.95), toQ16(0.0)),
    createStalk(toQ16(4.0), toQ16(6.5), toQ16(0.60), toQ16(0.0)),
    createStalk(toQ16(3.0), toQ16(9.8), toQ16(0.15), toQ16(0.0)),
    createStalk(toQ16(3.5), toQ16(2.0), toQ16(0.85), toQ16(0.0)),
    createStalk(toQ16(3.2), toQ16(3.0), toQ16(0.80), toQ16(0.0)),
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
    nodes,
    stalks,
    edges,
    labyrinth: CAMPAIGN_CHAPTERS[0].labyrinth,
  };
}
