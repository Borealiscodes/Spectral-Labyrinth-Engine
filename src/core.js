/**
 * src/core.js — Zero-Float Q16.16 Fixed-Point Math, Seeded PRNG & Versioned Save Schema
 * Enforces Ten Laws: Law 5 (Versioned Save Schema), Law 7 (Deterministic Seeded RNG),
 * and bit-exact cross-platform parity without IEEE-754 floating-point drift.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export const Q_SHIFT = 16n;
export const Q_ONE = 65536; // 1.0 in Q16.16
export const Q_HALF = 32768; // 0.5 in Q16.16
export const TIKHONOV_LAMBDA_Q16 = 98; // ~0.001495 (A7.2 λ = 0.0015 floor)
export const SAVE_SCHEMA_VERSION = "1.0.0-q16";

/**
 * Convert a finite JS number to a signed 32-bit Q16.16 integer.
 * Only used at initialization boundaries; runtime loops stay strictly integer.
 */
export function toQ16(num) {
  if (!Number.isFinite(num)) {
    throw new RangeError(`Non-finite input rejected at Q16.16 boundary: ${num}`);
  }
  const scaled = Math.round(num * Q_ONE);
  return scaled | 0;
}

/**
 * Convert a Q16.16 integer back to a JS float for read-only Ledger 2 UI display.
 */
export function fromQ16(q) {
  return (q | 0) / Q_ONE;
}

/**
 * Saturating signed 32-bit addition in Q16.16.
 */
export function qAdd(a, b) {
  const sum = (a | 0) + (b | 0);
  if (sum > 2147483647) return 2147483647;
  if (sum < -2147483648) return -2147483648;
  return sum | 0;
}

/**
 * Saturating signed 32-bit subtraction in Q16.16.
 */
export function qSub(a, b) {
  const diff = (a | 0) - (b | 0);
  if (diff > 2147483647) return 2147483647;
  if (diff < -2147483648) return -2147483648;
  return diff | 0;
}

/**
 * Exact 64-bit intermediate multiplication for Q16.16 values.
 */
export function qMul(a, b) {
  const prod = (BigInt(a | 0) * BigInt(b | 0)) >> Q_SHIFT;
  if (prod > 2147483647n) return 2147483647;
  if (prod < -2147483648n) return -2147483648;
  return Number(prod) | 0;
}

/**
 * Pole-safe Q16.16 division guarded by A7.2 Tikhonov denominator floor.
 */
export function qDivSafe(num, den, lambdaFloor = TIKHONOV_LAMBDA_Q16) {
  let d = den | 0;
  const floor = Math.max(1, Math.abs(lambdaFloor | 0));
  if (Math.abs(d) < floor) {
    d = d < 0 ? -floor : floor;
  }
  const quotient = (BigInt(num | 0) << Q_SHIFT) / BigInt(d);
  if (quotient > 2147483647n) return 2147483647;
  if (quotient < -2147483648n) return -2147483648;
  return Number(quotient) | 0;
}

/**
 * Deterministic Mulberry32 PRNG (Law 7: Deterministic Seeded RNG).
 */
export function createSeededRng(seedUint32) {
  let state = seedUint32 >>> 0;
  return function nextUint32() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
}

/**
 * Serialize deterministic Q16.16 world state with explicit schema version (Law 5).
 */
export function serializeSaveState({ tick, seed, horizonsInverted, stalks }) {
  return JSON.stringify({
    schema: SAVE_SCHEMA_VERSION,
    tick: tick | 0,
    seed: seed >>> 0,
    horizonsInverted: Boolean(horizonsInverted),
    stalks: stalks.map((s) => Array.from(s)),
  });
}

/**
 * Validate and restore a versioned save payload fail-closed.
 */
export function deserializeSaveState(rawJson) {
  const parsed = JSON.parse(rawJson);
  if (parsed.schema !== SAVE_SCHEMA_VERSION) {
    throw new Error(`Incompatible save schema: expected ${SAVE_SCHEMA_VERSION}, got ${parsed.schema}`);
  }
  if (!Array.isArray(parsed.stalks)) {
    throw new Error("Corrupt save payload: missing stalks array");
  }
  return {
    schema: parsed.schema,
    tick: parsed.tick | 0,
    seed: parsed.seed >>> 0,
    horizonsInverted: Boolean(parsed.horizonsInverted),
    stalks: parsed.stalks.map((arr) => Int32Array.from(arr)),
  };
}
