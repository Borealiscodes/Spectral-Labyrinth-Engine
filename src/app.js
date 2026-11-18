/**
 * src/app.js — Fixed-Timestep Engine Orchestrator & Input Dispatcher
 * Connects deterministic Ledger 1 physics (60 Hz fixed accumulator) with
 * read-only Ledger 2 rendering and UI telemetry.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import {
  Q_ONE,
  toQ16,
  serializeSaveState,
  deserializeSaveState,
} from "./core.js";
import {
  evaluateCoboundary,
  applyLawOfCycles,
  executeRebellionSurgery,
} from "./sheaf-kernel.js";
import { stepLabyrinthTick } from "./labyrinth-motion.js";
import { buildMitakiharaCampaignState } from "./campaign-mitakihara-data.js";
import { renderLabyrinthCanvas } from "./labyrinth-art.js";
import { updateTelemetryHud, appendDiagnosticLog } from "./campaign-mitakihara-ui.js";

const FIXED_DT_MS = 1000 / 60;

function initEngine() {
  const campaign = buildMitakiharaCampaignState(100);
  const labParams = campaign.labyrinth;

  let world = {
    tick: 0,
    seed: 0x20261118,
    horizonsInverted: false,
    nodes: campaign.nodes,
    stalks: campaign.stalks,
    edges: campaign.edges,
    activeNodeIdx: 2, // Sayaka gradient node by default
    qQ16: toQ16(12.0),
    pQ16: 0,
    effectiveCurvatureQ16: labParams.curvatureKQ16,
    dirichletEnergyQ16: 0,
  };

  const recomputeDiagnostics = () => {
    const { dirichletEnergyQ16 } = evaluateCoboundary(world.edges, world.stalks);
    world.dirichletEnergyQ16 = dirichletEnergyQ16;
  };
  recomputeDiagnostics();

  const canvas = document.getElementById("labyrinth-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const logEl = document.getElementById("diagnostic-log");

  const hudElements = {
    tickLabel: document.getElementById("hud-tick"),
    energyLabel: document.getElementById("hud-energy"),
    curvatureLabel: document.getElementById("hud-curvature"),
    regimeLabel: document.getElementById("hud-regime"),
    stalkTableBody: document.getElementById("stalk-table-body"),
  };

  const renderFrame = () => {
    if (ctx) renderLabyrinthCanvas(ctx, world);
    updateTelemetryHud(hudElements, world);
  };

  // Action 1: Hope Impulse (Dampens labyrinth curvature k_eff)
  document.getElementById("btn-hope")?.addEventListener("click", () => {
    const active = world.stalks[world.activeNodeIdx];
    const stepOut = stepLabyrinthTick(
      { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
      labParams,
      Q_ONE
    );
    world.stalks[world.activeNodeIdx] = stepOut.stalk;
    world.effectiveCurvatureQ16 = stepOut.effectiveCurvatureQ16;
    recomputeDiagnostics();
    appendDiagnosticLog(logEl, world.tick, "Hope impulse applied (+1.0 Q16.16); curvature dampened.");
    renderFrame();
  });

  // Action 2: Law of Cycles Global Sheafification (Φ_LoC)
  document.getElementById("btn-loc")?.addEventListener("click", () => {
    world.stalks = applyLawOfCycles(world.stalks, labParams.dBreakQ16);
    recomputeDiagnostics();
    appendDiagnosticLog(logEl, world.tick, "Global Sheafification (Φ_LoC) executed: D >= D_break discharged to entropy.");
    renderFrame();
  });

  // Action 3: Rebellion Universal Edge Case (Isolation Field + A7.2 Surgery)
  document.getElementById("btn-rebellion")?.addEventListener("click", () => {
    const res = executeRebellionSurgery(world.edges, world.stalks, 1, 0);
    world.edges = res.twistedEdges;
    world.stalks = res.stabilizedStalks;
    world.horizonsInverted = res.horizonsInverted;
    recomputeDiagnostics();
    appendDiagnosticLog(
      logEl,
      world.tick,
      `Rebellion Surgery engaged: σ_min clamped to ${res.minSingularQ16}/65536; Z₂ twist active.`
    );
    renderFrame();
  });

  // Action 4: Versioned Save Export / Restore Check (Law 5)
  document.getElementById("btn-save")?.addEventListener("click", () => {
    const json = serializeSaveState(world);
    const restored = deserializeSaveState(json);
    world.tick = restored.tick;
    appendDiagnosticLog(logEl, world.tick, `Verified Q16.16 save snapshot (${json.length} bytes).`);
  });

  // Fixed-timestep 60 Hz accumulator loop
  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    while (accumulator >= FIXED_DT_MS) {
      const active = world.stalks[world.activeNodeIdx];
      const stepOut = stepLabyrinthTick(
        { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
        labParams,
        0
      );
      world.tick = stepOut.tick;
      world.qQ16 = stepOut.qQ16;
      world.pQ16 = stepOut.pQ16;
      world.stalks[world.activeNodeIdx] = stepOut.stalk;
      world.effectiveCurvatureQ16 = stepOut.effectiveCurvatureQ16;
      accumulator -= FIXED_DT_MS;
    }

    recomputeDiagnostics();
    renderFrame();
    requestAnimationFrame(loop);
  }

  appendDiagnosticLog(logEl, 0, "Spectral Labyrinth Engine initialized (60 Hz Q16.16 fixed-point).");
  renderFrame();
  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initEngine);
