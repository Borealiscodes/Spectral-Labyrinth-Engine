/**
 * src/app.js — Fixed-Timestep Engine Orchestrator & Chapter Switcher (v0.3)
 * Connects deterministic Ledger 1 physics (60 Hz fixed accumulator) with
 * multi-chapter loading and deterministic game-verdict evaluation.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import {
  Q_ONE,
  toQ16,
  fromQ16,
  serializeSaveState,
  deserializeSaveState,
} from "./core.js";
import {
  evaluateCoboundary,
  applyLawOfCycles,
  executeRebellionSurgery,
  evaluateGameVerdict,
} from "./sheaf-kernel.js";
import {
  stepLabyrinthTick,
  computeEffectiveDistanceQ16,
} from "./labyrinth-motion.js";
import {
  CAMPAIGN_CHAPTERS,
  buildMitakiharaCampaignState,
} from "./campaign-mitakihara-data.js";
import { renderLabyrinthCanvas } from "./labyrinth-art.js";
import { updateTelemetryHud, appendDiagnosticLog } from "./campaign-mitakihara-ui.js";

const FIXED_DT_MS = 1000 / 60;

function initEngine() {
  const canvas = document.getElementById("labyrinth-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const logEl = document.getElementById("diagnostic-log");
  const chapterDescEl = document.getElementById("chapter-description");

  const hudElements = {
    tickLabel: document.getElementById("hud-tick"),
    energyLabel: document.getElementById("hud-energy"),
    curvatureLabel: document.getElementById("hud-curvature"),
    regimeLabel: document.getElementById("hud-regime"),
    verdictBanner: document.getElementById("verdict-banner"),
    stalkTableBody: document.getElementById("stalk-table-body"),
  };

  let world = null;

  const recomputeDiagnostics = () => {
    const { dirichletEnergyQ16 } = evaluateCoboundary(world.edges, world.stalks);
    world.dirichletEnergyQ16 = dirichletEnergyQ16;
    world.verdict = evaluateGameVerdict({
      tick: world.tick,
      targetTicks: world.targetTicks,
      nodes: world.nodes,
      stalks: world.stalks,
      dBreakQ16: world.labParams.dBreakQ16,
      entropyCeilingQ16: world.entropyCeilingQ16,
      horizonsInverted: world.horizonsInverted,
    });
  };

  const renderFrame = () => {
    if (ctx) renderLabyrinthCanvas(ctx, world);
    updateTelemetryHud(hudElements, world);
  };

  const loadChapter = (chapterId) => {
    const campaign = buildMitakiharaCampaignState(chapterId);
    const ch = campaign.chapter;

    world = {
      tick: 0,
      seed: 0x20261118,
      chapterId: ch.id,
      targetTicks: ch.targetTicks,
      entropyCeilingQ16: ch.entropyCeilingQ16,
      labParams: campaign.labyrinth,
      horizonsInverted: false,
      nodes: campaign.nodes,
      stalks: campaign.stalks,
      edges: campaign.edges,
      activeNodeIdx: ch.autoRebellion ? 1 : 2,
      qQ16: toQ16(12.0),
      pQ16: 0,
      effectiveCurvatureQ16: campaign.labyrinth.curvatureKQ16,
      dirichletEnergyQ16: 0,
      verdict: null,
    };

    if (ch.autoRebellion) {
      const res = executeRebellionSurgery(world.edges, world.stalks, 1, 0);
      world.edges = res.twistedEdges;
      world.stalks = res.stabilizedStalks;
      world.horizonsInverted = res.horizonsInverted;
    }

    if (chapterDescEl) {
      chapterDescEl.textContent = `${ch.title} — ${ch.description}`;
    }

    recomputeDiagnostics();
    appendDiagnosticLog(logEl, 0, `Loaded ${ch.title} (Target: ${ch.targetTicks} ticks).`);
    renderFrame();
  };

  // Wire Chapter Switcher buttons
  document.querySelectorAll("[data-chapter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      loadChapter(btn.getAttribute("data-chapter"));
    });
  });

  const applyRadialThrust = (deltaMomentumQ16, directionLabel) => {
    if (world.verdict?.halted) return;
    world.pQ16 = (world.pQ16 + deltaMomentumQ16) | 0;
    const dEff = computeEffectiveDistanceQ16(
      Q_ONE,
      Math.abs(world.qQ16),
      world.effectiveCurvatureQ16,
      world.labParams.labRadiusQ16
    );
    appendDiagnosticLog(
      logEl,
      world.tick,
      `${directionLabel} | r=${Math.abs(fromQ16(world.qQ16)).toFixed(2)} | d_eff=${fromQ16(dEff).toFixed(2)}x`
    );
    renderFrame();
  };

  document.getElementById("btn-hope")?.addEventListener("click", () => {
    if (world.verdict?.halted) return;
    const active = world.stalks[world.activeNodeIdx];
    const targetName = world.nodes[world.activeNodeIdx]?.id.toUpperCase() || "NODE";
    const stepOut = stepLabyrinthTick(
      { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
      world.labParams,
      Q_ONE
    );
    world.stalks[world.activeNodeIdx] = stepOut.stalk;
    world.effectiveCurvatureQ16 = stepOut.effectiveCurvatureQ16;
    recomputeDiagnostics();
    appendDiagnosticLog(logEl, world.tick, `Hope impulse (+1.0 Q16.16) applied to ${targetName}.`);
    renderFrame();
  });

  document.getElementById("btn-loc")?.addEventListener("click", () => {
    if (world.verdict?.halted) return;
    world.stalks = applyLawOfCycles(world.stalks, world.labParams.dBreakQ16);
    recomputeDiagnostics();
    appendDiagnosticLog(logEl, world.tick, "Global Sheafification (Φ_LoC) executed.");
    renderFrame();
  });

  document.getElementById("btn-rebellion")?.addEventListener("click", () => {
    if (world.verdict?.halted) return;
    const res = executeRebellionSurgery(world.edges, world.stalks, 1, 0);
    world.edges = res.twistedEdges;
    world.stalks = res.stabilizedStalks;
    world.horizonsInverted = res.horizonsInverted;
    recomputeDiagnostics();
    appendDiagnosticLog(
      logEl,
      world.tick,
      `Rebellion Surgery engaged: σ_min=${res.minSingularQ16}/65536; Z₂ twist active.`
    );
    renderFrame();
  });

  document.getElementById("btn-save")?.addEventListener("click", () => {
    const json = serializeSaveState(world);
    const restored = deserializeSaveState(json);
    appendDiagnosticLog(logEl, restored.tick, `Verified Q16.16 save snapshot (${json.length} bytes).`);
  });

  document.getElementById("btn-dive")?.addEventListener("click", () => {
    applyRadialThrust(-toQ16(1.5), "Inward radial thrust");
  });

  document.getElementById("btn-retreat")?.addEventListener("click", () => {
    applyRadialThrust(toQ16(1.5), "Outward radial thrust");
  });

  canvas?.addEventListener("pointerdown", (ev) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (ev.clientX - rect.left) * scaleX;
    const clickY = (ev.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const orbitR = Math.min(cx, cy) * 0.85 * 0.62;

    world.nodes.forEach((node, idx) => {
      if (node.role === "entropy_sink") return;
      const angle = (idx / world.nodes.length) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + Math.cos(angle) * orbitR;
      const ny = cy + Math.sin(angle) * orbitR;
      if (Math.hypot(clickX - nx, clickY - ny) <= 28) {
        world.activeNodeIdx = idx;
        appendDiagnosticLog(logEl, world.tick, `Target locked: ${node.label}`);
        renderFrame();
      }
    });
  });

  window.addEventListener("keydown", (ev) => {
    const thrust = toQ16(1.5);
    if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
      applyRadialThrust(-thrust, "Inward radial thrust (W/Up)");
    } else if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
      applyRadialThrust(thrust, "Outward radial thrust (S/Down)");
    }
  });

  // Boot Chapter I
  loadChapter(CAMPAIGN_CHAPTERS[0].id);

  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    if (!world.verdict?.halted) {
      while (accumulator >= FIXED_DT_MS) {
        const active = world.stalks[world.activeNodeIdx];
        const stepOut = stepLabyrinthTick(
          { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
          world.labParams,
          0
        );
        world.tick = stepOut.tick;
        world.qQ16 = stepOut.qQ16;
        world.pQ16 = stepOut.pQ16;
        world.stalks[world.activeNodeIdx] = stepOut.stalk;
        world.effectiveCurvatureQ16 = stepOut.effectiveCurvatureQ16;
        accumulator -= FIXED_DT_MS;

        recomputeDiagnostics();
        if (world.verdict?.halted) {
          appendDiagnosticLog(logEl, world.tick, `GAME VERDICT: ${world.verdict.status} — ${world.verdict.reason}`);
          break;
        }
      }
    } else {
      accumulator = 0;
    }

    renderFrame();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initEngine);
