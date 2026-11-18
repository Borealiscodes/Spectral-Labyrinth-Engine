/**
 * src/replay-verifier.js — Deterministic Input-Log Replay & State Receipt Engine (v1.0)
 * Re-simulates a campaign run from tick 0 using recorded { tick, action, targetIdx }
 * events in pure Q16.16 fixed-point arithmetic and computes an immutable SHA-256
 * state digest across both Node.js and browser runtimes.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16, serializeSaveState } from "./core.js";
import {
  evaluateCoboundary,
  applyLawOfCycles,
  executeRebellionSurgery,
  evaluateGameVerdict,
} from "./sheaf-kernel.js";
import { stepLabyrinthTick } from "./labyrinth-motion.js";
import { buildMitakiharaCampaignState } from "./campaign-mitakihara-data.js";

/**
 * Pure-JS synchronous SHA-256 for bit-exact cross-environment state receipts
 * (works identically in Node.js CLI tests and browser ESM without async WebCrypto).
 */
export function sha256Hex(asciiStr) {
  const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = "";

  const words = [];
  const asciiBitLength = asciiStr.length * 8;
  const hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  asciiStr += "\x80";
  while ((asciiStr.length % 64) - 56) asciiStr += "\x00";
  for (let i = 0; i < asciiStr.length; i++) {
    const j = asciiStr.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash.unshift((temp1 + temp2) | 0);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }

    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

/**
 * Compute an immutable SHA-256 fingerprint over the Q16.16 simulation snapshot.
 */
export function computeWorldReceiptDigest(world) {
  const canonicalPayload = JSON.stringify({
    save: JSON.parse(serializeSaveState(world)),
    qQ16: world.qQ16 | 0,
    pQ16: world.pQ16 | 0,
    dirichletEnergyQ16: world.dirichletEnergyQ16 | 0,
    verdictStatus: world.verdict?.status || "UNKNOWN",
  });
  return sha256Hex(canonicalPayload);
}

/**
 * Deterministically replay a campaign from tick 0 using a recorded inputLog.
 * Each entry in inputLog: { tick: number, action: string, targetIdx?: number }
 */
export function replayCampaignRun(chapterId, inputLog, totalTicks) {
  const campaign = buildMitakiharaCampaignState(chapterId);
  const ch = campaign.chapter;

  const world = {
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

  const refresh = () => {
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

  refresh();

  // Group events by tick for O(1) deterministic dispatch
  const eventsByTick = new Map();
  for (const ev of inputLog) {
    const t = ev.tick | 0;
    if (!eventsByTick.has(t)) eventsByTick.set(t, []);
    eventsByTick.get(t).push(ev);
  }

  const applyEventsAtTick = (t) => {
    const list = eventsByTick.get(t);
    if (!list || world.verdict?.halted) return;

    for (const ev of list) {
      if (ev.action === "SELECT_NODE" && typeof ev.targetIdx === "number") {
        world.activeNodeIdx = ev.targetIdx;
      } else if (ev.action === "HOPE_IMPULSE") {
        const active = world.stalks[world.activeNodeIdx];
        const out = stepLabyrinthTick(
          { tick: world.tick, qQ16: world.qQ16, pQ16: world.pQ16, stalk: active },
          world.labParams,
          Q_ONE
        );
        world.stalks[world.activeNodeIdx] = out.stalk;
        world.effectiveCurvatureQ16 = out.effectiveCurvatureQ16;
      } else if (ev.action === "LAW_OF_CYCLES") {
        world.stalks = applyLawOfCycles(world.stalks, world.labParams.dBreakQ16);
      } else if (ev.action === "REBELLION_SURGERY") {
        const res = executeRebellionSurgery(world.edges, world.stalks, 1, 0);
        world.edges = res.twistedEdges;
        world.stalks = res.stabilizedStalks;
        world.horizonsInverted = res.horizonsInverted;
      } else if (ev.action === "THRUST_IN") {
        world.pQ16 = (world.pQ16 - toQ16(1.5)) | 0;
      } else if (ev.action === "THRUST_OUT") {
        world.pQ16 = (world.pQ16 + toQ16(1.5)) | 0;
      }
      refresh();
    }
  };

  applyEventsAtTick(0);

  for (let step = 0; step < totalTicks; step++) {
    if (world.verdict?.halted) break;

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

    refresh();
    applyEventsAtTick(world.tick);
  }

  return {
    finalTick: world.tick,
    verdict: world.verdict,
    digest: computeWorldReceiptDigest(world),
    world,
  };
}
