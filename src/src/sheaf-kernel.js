/**
 * src/sheaf-kernel.js — Deterministic Cellular Sheaf & Thermodynamic Kernel (Ledger 1)
 * Ports MadokaSheafTopology.jl invariants into zero-float Q16.16 fixed-point operations:
 *   - 4D Stalks: [0: Hope, 1: Despair, 2: Purity, 3: Entropy]
 *   - Weighted 0-coboundary δ⁰ & H¹ Dirichlet frustration energy
 *   - Discrete First & Second Laws of Thermodynamics
 *   - Law of Cycles Global Sheafification (Φ_LoC)
 *   - Rebellion Universal Edge Case (Incubator Isolation + A7.2 Tikhonov Clamp + Z₂ Twist)
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
  toQ16,
} from "./core.js";

/**
 * Create a 4D Q16.16 Stalk vector: Int32Array([H, D, R, S_ent]).
 */
export function createStalk(hopeQ16, despairQ16, purityQ16, entropyQ16) {
  return Int32Array.from([
    hopeQ16 | 0,
    despairQ16 | 0,
    purityQ16 | 0,
    entropyQ16 | 0,
  ]);
}

/**
 * Create a 4x4 diagonal restriction operator in Q16.16.
 */
export function diagOperator(d0, d1, d2, d3) {
  return Int32Array.from([d0 | 0, d1 | 0, d2 | 0, d3 | 0]);
}

export function identityOperator() {
  return diagOperator(Q_ONE, Q_ONE, Q_ONE, Q_ONE);
}

/**
 * Apply a 4x4 diagonal Q16.16 restriction map to a 4D stalk.
 */
export function applyDiagOperator(op, stalk) {
  return Int32Array.from([
    qMul(op[0], stalk[0]),
    qMul(op[1], stalk[1]),
    qMul(op[2], stalk[2]),
    qMul(op[3], stalk[3]),
  ]);
}

/**
 * Compute logarithmic loop weight w_e = 1 + ln(max(1, loops)) in Q16.16.
 */
export function computeLoopWeightQ16(loops) {
  const safeLoops = Math.max(1, loops | 0);
  const weightFloat = 1.0 + Math.log(safeLoops);
  return toQ16(weightFloat);
}

/**
 * Compute 0-coboundary (δ⁰x)_e = w_e * (F_{src◁e}(x_src) - F_{dst◁e}(x_dst))
 * and total Dirichlet frustration energy E(x) = 1/2 ||δ⁰x||² in Q16.16.
 */
export function evaluateCoboundary(edges, stalks) {
  let totalNormSqQ16 = 0;
  const edgeDiscrepancies = [];

  for (const edge of edges) {
    const mappedSrc = applyDiagOperator(edge.fSrc, stalks[edge.src]);
    const mappedDst = applyDiagOperator(edge.fDst, stalks[edge.dst]);
    const diff = createStalk(
      qMul(edge.loopWeightQ16, qSub(mappedSrc[0], mappedDst[0])),
      qMul(edge.loopWeightQ16, qSub(mappedSrc[1], mappedDst[1])),
      qMul(edge.loopWeightQ16, qSub(mappedSrc[2], mappedDst[2])),
      qMul(edge.loopWeightQ16, qSub(mappedSrc[3], mappedDst[3]))
    );
    edgeDiscrepancies.push(diff);

    for (let i = 0; i < 4; i++) {
      totalNormSqQ16 = qAdd(totalNormSqQ16, qMul(diff[i], diff[i]));
    }
  }

  const dirichletEnergyQ16 = qMul(Q_HALF, totalNormSqQ16);
  return { edgeDiscrepancies, dirichletEnergyQ16 };
}

/**
 * Enforce Discrete First & Second Laws of Thermodynamics in exact Q16.16:
 *   - First Law: ∑(H - D) == ∑(H' - D') + W_harvest (within ±2 Q16 LSB tolerance)
 *   - Second Law: ∑ S'_ent >= ∑ S_ent
 */
export function verifyThermodynamicLaws(beforeStalks, afterStalks, harvestedWorkQ16, lsbTolerance = 2) {
  let netEnergyBefore = 0;
  let netEnergyAfter = harvestedWorkQ16 | 0;
  let entropyBefore = 0;
  let entropyAfter = 0;

  for (const s of beforeStalks) {
    netEnergyBefore = qAdd(netEnergyBefore, qSub(s[0], s[1]));
    entropyBefore = qAdd(entropyBefore, s[3]);
  }
  for (const s of afterStalks) {
    netEnergyAfter = qAdd(netEnergyAfter, qSub(s[0], s[1]));
    entropyAfter = qAdd(entropyAfter, s[3]);
  }

  const firstLawHolds = Math.abs(netEnergyBefore - netEnergyAfter) <= lsbTolerance;
  const secondLawHolds = entropyAfter >= entropyBefore;
  return {
    admissible: firstLawHolds && secondLawHolds,
    firstLawHolds,
    secondLawHolds,
    deltaEntropyQ16: qSub(entropyAfter, entropyBefore),
  };
}

/**
 * Global Sheafification Functor (Law of Cycles / Φ_LoC):
 * Intercepts any node reaching D >= dBreakQ16, clears Despair to 0,
 * restores Purity to Q_ONE, and discharges curse load cleanly into Entropy.
 */
export function applyLawOfCycles(stalks, dBreakQ16) {
  return stalks.map((s) => {
    const [hope, despair, , entropy] = s;
    if (despair >= (dBreakQ16 | 0)) {
      return createStalk(0, 0, Q_ONE, qAdd(entropy, despair));
    }
    return Int32Array.from(s);
  });
}

/**
 * Universal Edge Case: Rebellion Isolation Field & A7.2 Collapse-Surface Surgery.
 *   1. Incubator Isolation Field severs restriction maps to Law of Cycles anchor (madokaIdx).
 *   2. A7.2 Tikhonov clamp enforces minSingularQ16 >= TIKHONOV_LAMBDA_Q16 (98) to block poles.
 *   3. Akuma Homura Z₂ twist inverts Despair transport (-Q_ONE) on boundary edges,
 *      sustaining non-trivial H¹ cohomology in metastable equilibrium.
 */
export function executeRebellionSurgery(edges, stalks, homuraIdx, madokaIdx, lambdaQ16 = TIKHONOV_LAMBDA_Q16) {
  const floor = Math.max(1, lambdaQ16 | 0);
  let minSingularQ16 = Q_ONE;

  const twistedEdges = edges.map((edge) => {
    if (edge.src === madokaIdx || edge.dst === madokaIdx) {
      // Severed restriction map clamped at A7.2 Tikhonov floor
      const fReg = diagOperator(floor, floor, floor, floor);
      if (floor < minSingularQ16) minSingularQ16 = floor;

      // Akuma Homura Z₂ orientation twist (Horizon Inversion on Despair channel)
      const z2Twist = diagOperator(Q_ONE, -Q_ONE, Q_ONE, Q_ONE);
      return {
        ...edge,
        fSrc: fReg,
        fDst: z2Twist,
      };
    }
    return {
      ...edge,
      fSrc: Int32Array.from(edge.fSrc),
      fDst: Int32Array.from(edge.fDst),
    };
  });

  const stabilizedStalks = stalks.map((s, idx) => {
    const copy = Int32Array.from(s);
    if (idx === homuraIdx && copy[2] < floor) {
      // Clamp Soul Gem purity above collapse floor inside Dark Orb containment
      copy[2] = floor;
    }
    return copy;
  });

  return {
    twistedEdges,
    stabilizedStalks,
    minSingularQ16,
    horizonsInverted: true,
  };
}
