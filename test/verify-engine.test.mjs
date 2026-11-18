/**
 * test/verify-engine.test.mjs — Automated Deterministic Game-Verdict Suite (v0.3)
 * Verifies Q16.16 fixed-point arithmetic, save serialization (Law 5),
 * seeded RNG determinism (Law 7), cellular sheaf coboundary, thermodynamic laws,
 * Rebellion A7.2 collapse repair, symplectic labyrinth integration, and v0.3
 * multi-chapter game-verdict state transitions.
 *
 * Run: node --test test/verify-engine.test.mjs
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  Q_ONE,
  TIKHONOV_LAMBDA_Q16,
  toQ16,
  fromQ16,
  qMul,
  qDivSafe,
  createSeededRng,
  serializeSaveState,
  deserializeSaveState,
} from "../src/core.js";

import {
  createStalk,
  identityOperator,
  computeLoopWeightQ16,
  evaluateCoboundary,
  verifyThermodynamicLaws,
  applyLawOfCycles,
  executeRebellionSurgery,
  evaluateGameVerdict,
} from "../src/sheaf-kernel.js";

import {
  computeEffectiveDistanceQ16,
  stepLabyrinthTick,
} from "../src/labyrinth-motion.js";

import {
  CAMPAIGN_CHAPTERS,
  buildMitakiharaCampaignState,
} from "../src/campaign-mitakihara-data.js";

test("1. Q16.16 Fixed-Point & Pole-Safe Tikhonov Division", () => {
  const two = toQ16(2.0);
  const three = toQ16(3.0);
  assert.equal(qMul(two, three), toQ16(6.0));

  // Division by zero clamps cleanly to TIKHONOV_LAMBDA_Q16 without NaN or throw
  const safeQuotient = qDivSafe(Q_ONE, 0);
  assert.ok(Number.isInteger(safeQuotient));
  assert.ok(safeQuotient > 0);
});

test("2. Seeded PRNG (Law 7) & Versioned Save Roundtrip (Law 5)", () => {
  const rngA = createSeededRng(0x12345678);
  const rngB = createSeededRng(0x12345678);
  assert.equal(rngA(), rngB());
  assert.equal(rngA(), rngB());

  const s0 = createStalk(toQ16(5.0), toQ16(1.5), toQ16(0.9), toQ16(0.0));
  const payload = serializeSaveState({
    tick: 120,
    seed: 42,
    horizonsInverted: false,
    stalks: [s0],
  });
  const restored = deserializeSaveState(payload);
  assert.equal(restored.tick, 120);
  assert.deepEqual(Array.from(restored.stalks[0]), Array.from(s0));

  // Reject mismatched schema versions fail-closed
  const badPayload = payload.replace("1.0.0-q16", "0.9.0-legacy");
  assert.throws(() => deserializeSaveState(badPayload), /Incompatible save schema/);
});

test("3. Cellular Sheaf Coboundary & H1 Loop Frustration Energy", () => {
  const id = identityOperator();
  const sMadoka = createStalk(toQ16(12.0), toQ16(0.5), toQ16(0.95), 0);
  const sHomura = createStalk(toQ16(4.0), toQ16(6.5), toQ16(0.60), 0);
  const weight100 = computeLoopWeightQ16(100);

  const edges = [
    { src: 1, dst: 0, fSrc: id, fDst: id, loopWeightQ16: weight100 },
  ];

  const { dirichletEnergyQ16 } = evaluateCoboundary(edges, [sMadoka, sHomura]);
  assert.ok(dirichletEnergyQ16 > 0, "Timeline loop mismatch must yield positive H1 energy");

  // Uniform global section yields zero coboundary energy
  const flatResult = evaluateCoboundary(edges, [sMadoka, sMadoka]);
  assert.equal(flatResult.dirichletEnergyQ16, 0);
});

test("4. First & Second Laws of Thermodynamics + Law of Cycles Sheafification", () => {
  const before = [createStalk(toQ16(12.0), toQ16(1.0), toQ16(0.9), toQ16(1.0))];
  const after = [createStalk(toQ16(4.0), toQ16(0.0), toQ16(0.0), toQ16(3.5))];
  const harvestedWork = toQ16(7.0);

  const valid = verifyThermodynamicLaws(before, after, harvestedWork);
  assert.equal(valid.admissible, true);
  assert.equal(valid.firstLawHolds, true);
  assert.equal(valid.secondLawHolds, true);

  // Law of Cycles clears nodes exceeding D_break into clean entropy
  const criticalNode = [createStalk(toQ16(2.0), toQ16(10.5), toQ16(0.05), toQ16(1.0))];
  const purified = applyLawOfCycles(criticalNode, toQ16(10.0));
  assert.equal(purified[0][1], 0);
  assert.equal(purified[0][2], Q_ONE);
  assert.equal(purified[0][3], toQ16(11.5));
});

test("5. Universal Edge Case: Rebellion Isolation & A7.2 Collapse Repair", () => {
  const id = identityOperator();
  const sMadoka = createStalk(toQ16(15.0), toQ16(0.0), Q_ONE, 0);
  const sHomura = createStalk(toQ16(4.0), toQ16(12.5), toQ16(0.01), toQ16(2.0));
  const edges = [
    { src: 1, dst: 0, fSrc: id, fDst: id, loopWeightQ16: computeLoopWeightQ16(100) },
  ];

  const { twistedEdges, stabilizedStalks, minSingularQ16, horizonsInverted } =
    executeRebellionSurgery(edges, [sMadoka, sHomura], 1, 0);

  assert.equal(horizonsInverted, true);
  assert.ok(minSingularQ16 >= TIKHONOV_LAMBDA_Q16);
  assert.ok(stabilizedStalks[1][2] >= TIKHONOV_LAMBDA_Q16);

  const { dirichletEnergyQ16 } = evaluateCoboundary(twistedEdges, stabilizedStalks);
  assert.ok(dirichletEnergyQ16 > 0, "Twisted bundle sustains metastable H1 != 0");
});

test("6. Symplectic Labyrinth Spatial Distortion & Multi-Tick Integration", () => {
  const dEff = computeEffectiveDistanceQ16(toQ16(10.0), 0, toQ16(2.5), toQ16(500.0));
  assert.ok(fromQ16(dEff) > 34.0 && fromQ16(dEff) <= 35.0);

  const params = {
    curvatureKQ16: toQ16(2.0),
    maxHopeQ16: toQ16(10.0),
    maxPurityQ16: Q_ONE,
    alphaQ16: toQ16(0.6),
    betaQ16: toQ16(1.0),
    gammaQ16: toQ16(1.0),
    dBreakQ16: toQ16(10.0),
  };

  let simState = {
    tick: 0,
    qQ16: toQ16(5.0),
    pQ16: 0,
    stalk: createStalk(toQ16(3.0), toQ16(1.0), toQ16(0.8), 0),
  };

  for (let i = 0; i < 60; i++) {
    simState = stepLabyrinthTick(simState, params, 0);
  }
  assert.equal(simState.tick, 60);
  assert.equal(simState.breached, false);
  assert.ok(simState.stalk[1] > toQ16(1.0), "Despair accumulates monotonically without Hope action");
});

test("7. Multi-Chapter Campaign & Deterministic Game-Verdict State Machine (v0.3)", () => {
  assert.equal(CAMPAIGN_CHAPTERS.length, 3);

  const ch1 = buildMitakiharaCampaignState("chapter-1-walpurgisnacht");
  const dBreak = ch1.labyrinth.dBreakQ16;
  const ceiling = ch1.chapter.entropyCeilingQ16;

  // 1. Active state when tick < targetTicks
  const activeVerdict = evaluateGameVerdict({
    tick: 100,
    targetTicks: 1800,
    nodes: ch1.nodes,
    stalks: ch1.stalks,
    dBreakQ16: dBreak,
    entropyCeilingQ16: ceiling,
    horizonsInverted: false,
  });
  assert.equal(activeVerdict.status, "ACTIVE");
  assert.equal(activeVerdict.halted, false);

  // 2. Victory state when tick >= targetTicks and all non-sink nodes < D_break
  const purifiedStalks = applyLawOfCycles(ch1.stalks, dBreak);
  const winVerdict = evaluateGameVerdict({
    tick: 1800,
    targetTicks: 1800,
    nodes: ch1.nodes,
    stalks: purifiedStalks,
    dBreakQ16: dBreak,
    entropyCeilingQ16: ceiling,
    horizonsInverted: false,
  });
  assert.equal(winVerdict.status, "VICTORY_STABILIZED");
  assert.equal(winVerdict.halted, true);

  // 3. Catastrophic breach when Despair >= 5 * D_break (50.0) without Horizon Inversion
  const collapsedStalks = ch1.stalks.map((s) => Int32Array.from(s));
  collapsedStalks[2][1] = toQ16(51.0);
  const breachVerdict = evaluateGameVerdict({
    tick: 500,
    targetTicks: 1800,
    nodes: ch1.nodes,
    stalks: collapsedStalks,
    dBreakQ16: dBreak,
    entropyCeilingQ16: ceiling,
    horizonsInverted: false,
  });
  assert.equal(breachVerdict.status, "BREACH_COLLAPSE");
  assert.equal(breachVerdict.halted, true);

  // 4. Entropy overflow when total entropy exceeds chapter ceiling
  const overflowStalks = ch1.stalks.map((s) => Int32Array.from(s));
  overflowStalks[5][3] = toQ16(260.0);
  const overflowVerdict = evaluateGameVerdict({
    tick: 600,
    targetTicks: 1800,
    nodes: ch1.nodes,
    stalks: overflowStalks,
    dBreakQ16: dBreak,
    entropyCeilingQ16: ceiling,
    horizonsInverted: false,
  });
  assert.equal(overflowVerdict.status, "ENTROPY_OVERFLOW");
  assert.equal(overflowVerdict.halted, true);
});
