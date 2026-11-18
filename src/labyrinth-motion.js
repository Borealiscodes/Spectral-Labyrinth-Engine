/**
 * src/labyrinth-motion.js — Zero-Float Q16.16 Symplectic Labyrinth Integrator (Ledger 1)
 * Implements fixed-timestep (60 Hz) kick-drift-kick spatial traversal and
 * Hope/Despair field evolution from Spectral Labyrinth Engine v1.0.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import {
  Q_ONE,
  Q_HALF,
  TIKHONOV_LAMBDA_Q16,
  qAdd,
  qSub,
  qMul,
  qDivSafe,
  toQ16,
} from "./core.js";

export const DT_60HZ_Q16 = toQ16(1.0 / 60.0); // ~1092 in Q16.16

/**
 * Rational Padé-like fixed-point exponential decay approximation for exp(-x)
 * where x >= 0 in Q16.16: exp(-x) ≈ 1 / (1 + x + 0.5 * x^2).
 * Monotonic, pole-free, and strictly bounded in (0, Q_ONE].
 */
export function qExpNeg(xQ16) {
  const x = Math.max(0, xQ16 | 0);
  const xSq = qMul(x, x);
  const halfXSq = qMul(Q_HALF, xSq);
  const denom = qAdd(Q_ONE, qAdd(x, halfXSq));
  return qDivSafe(Q_ONE, denom, Q_ONE);
}

/**
 * Compute effective spatial distortion inside a curved labyrinth:
 *   d_eff = d * (1 + k * exp(-r / R_lab))
 */
export function computeEffectiveDistanceQ16(distanceQ16, radiusQ16, curvatureKQ16, labRadiusQ16) {
  const ratio = qDivSafe(Math.max(0, radiusQ16 | 0), labRadiusQ16, TIKHONOV_LAMBDA_Q16);
  const decay = qExpNeg(ratio);
  const warpFactor = qAdd(Q_ONE, qMul(curvatureKQ16, decay));
  return qMul(distanceQ16, warpFactor);
}

/**
 * Compute effective curvature dampened by team Hope pool:
 *   k_eff = k / (1 + gamma * (H_team / H_max))
 */
export function computeEffectiveCurvatureQ16(curvatureKQ16, teamHopeQ16, maxTeamHopeQ16, gammaQ16) {
  const hopeRatio = qDivSafe(Math.max(0, teamHopeQ16 | 0), maxTeamHopeQ16, TIKHONOV_LAMBDA_Q16);
  const denom = qAdd(Q_ONE, qMul(gammaQ16, hopeRatio));
  return qDivSafe(curvatureKQ16, denom, Q_ONE);
}

/**
 * Single fixed-timestep symplectic Störmer-Verlet step for phase-space coordinates (q, p)
 * under radial restoring gradient, plus Hope/Despair field update on the active stalk.
 */
export function stepLabyrinthTick(state, params, actionHopeImpulseQ16 = 0) {
  const dt = DT_60HZ_Q16;
  const halfDt = qMul(Q_HALF, dt);

  // 1. Compute dampened curvature k_eff
  const kEff = computeEffectiveCurvatureQ16(
    params.curvatureKQ16,
    state.stalk[0],
    params.maxHopeQ16,
    params.gammaQ16
  );

  // 2. Symplectic Kick-Drift-Kick on radial coordinate q and momentum p
  const accel0 = -qMul(kEff, state.qQ16);
  const pHalf = qAdd(state.pQ16, qMul(halfDt, accel0));
  const qNext = qAdd(state.qQ16, qMul(dt, pHalf));
  const accel1 = -qMul(kEff, qNext);
  const pNext = qAdd(pHalf, qMul(halfDt, accel1));

  // 3. Update Hope (channel 0) and Despair (channel 1) on the active 4D stalk
  const nextStalk = Int32Array.from(state.stalk);
  const hopeGain = qMul(params.betaQ16, actionHopeImpulseQ16);
  nextStalk[0] = qAdd(nextStalk[0], hopeGain);

  const protectionRatio = qDivSafe(
    qAdd(nextStalk[0], nextStalk[2]),
    qAdd(params.maxHopeQ16, params.maxPurityQ16),
    TIKHONOV_LAMBDA_Q16
  );
  const vulnerability = Math.max(0, qSub(Q_ONE, protectionRatio));
  const deltaDespair = qMul(dt, qMul(params.alphaQ16, qMul(kEff, vulnerability)));
  nextStalk[1] = qAdd(nextStalk[1], deltaDespair);

  const breached = nextStalk[1] >= params.dBreakQ16;

  return {
    tick: (state.tick | 0) + 1,
    qQ16: qNext,
    pQ16: pNext,
    stalk: nextStalk,
    effectiveCurvatureQ16: kEff,
    breached,
  };
}
