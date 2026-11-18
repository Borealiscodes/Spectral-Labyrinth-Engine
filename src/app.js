/**
 * src/app.js — Fixed-Timestep Engine Orchestrator & Input Dispatcher (v0.2)
 * Connects deterministic Ledger 1 physics (60 Hz fixed accumulator) with
 * read-only Ledger 2 rendering, pointer/touch 0-cell selection, and radial thrust.
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
} from "./sheaf-kernel.js";
import {
  stepLabyrinthTick,
  computeEffectiveDistanceQ16,
} from "./labyrinth-motion.js";
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

  const applyRadialThrust = (deltaMomentumQ16, directionLabel) => {
    world.pQ16 = (world.pQ16 + deltaMomentumQ16) | 0;
    const dEff = computeEffectiveDistanceQ16(
      Q_ONE,
      Math.abs(world.qQ16),
      world.effectiveCurvatureQ16,
      labParams.labRadiusQ16
    );
    appendDiagnosticLog(
      logEl,
      world.tick,
      `${directionLabel} | r=${Math.abs(fromQ16(world.qQ16)).toFixed(2)} | d_eff=${fromQ16(dEff).toFixed(2)}x`
    );
    renderFrame();
  };

  // Action 1: Hope Impulse routed to currently selected 0-cell node
  document.getElementById("btn-hope")?.addEventListener("click", () => {
    const active = world.stalks[world.activeNodeIdx];
    const targetName = world.nodes[world.activeNodeIdx]?.id.toUpperCase() || "NODE";
    const stepOut = stepLabyrinthTick(
      { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
      labParams,
      Q_ONE
    );
    world.stalks[world.activeNodeIdx] = stepOut.stalk;
    world.effectiveCurvatureQ16 = stepOut.effectiveCurvatureQ16;
    recomputeDiagnostics();
    appendDiagnosticLog(
      logEl,
      world.tick,
      `Hope impulse (+1.0 Q16.16) applied to ${targetName}; curvature dampened.`
    );
    renderFrame();
  });

  // Action 2: Law of Cycles Global Sheafification (Φ_LoC)
  document.getElementById("btn-loc")?.addEventListener("click", () => {
    world.stalks = applyLawOfCycles(world.stalks, labParams.dBreakQ16);
    recomputeDiagnostics();
    appendDiagnosticLog(
      logEl,
      world.tick,
      "Global Sheafification (Φ_LoC) executed: D >= D_break discharged to entropy."
    );
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

  // Action 5: Touch-Friendly Radial Thrust Buttons (Dive In / Retreat)
  document.getElementById("btn-dive")?.addEventListener("click", () => {
    applyRadialThrust(-toQ16(1.5), "Inward radial thrust");
  });

  document.getElementById("btn-retreat")?.addEventListener("click", () => {
    applyRadialThrust(toQ16(1.5), "Outward radial thrust");
  });

  // Pointer / Touch Selection on Canvas to target any non-sink 0-cell node
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

  // Keyboard WASD / Arrow Keys for Radial Momentum Thrust
  window.addEventListener("keydown", (ev) => {
    const thrust = toQ16(1.5);
    if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
      applyRadialThrust(-thrust, "Inward radial thrust (W/Up)");
    } else if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
      applyRadialThrust(thrust, "Outward radial thrust (S/Down)");
    }
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

  appendDiagnosticLog(
    logEl,
    0,
    "Spectral Labyrinth Engine v0.2 initialized (tap any node to target; W/S or buttons for radial thrust)."
  );
  renderFrame();
  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initEngine);
