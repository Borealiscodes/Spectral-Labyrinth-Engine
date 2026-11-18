/**
 * src/labyrinth-audio.js — Optional Ledger 2 WebAudio Harmonic Synthesizer (v1.0)
 * Strictly presentation-only and mute-by-default: emits brief harmonic sine cues
 * (288 Hz Hope impulse, 432 Hz Law of Cycles, 528 Hz Horizon Inversion) without
 * ever reading or mutating Ledger 1 physics state.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export function createLabyrinthAudio() {
  let muted = true;
  let audioCtx = null;

  const ensureContext = () => {
    if (!audioCtx && typeof window !== "undefined") {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  };

  const playTone = (freqHz, durationSec = 0.28, gainPeak = 0.06) => {
    if (muted) return;
    const ctx = ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freqHz, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  };

  return {
    isMuted: () => muted,
    toggleMute: () => {
      muted = !muted;
      if (!muted) ensureContext();
      return muted;
    },
    cueHopeImpulse: () => playTone(288, 0.22, 0.05),
    cueLawOfCycles: () => {
      playTone(432, 0.35, 0.06);
      setTimeout(() => playTone(540, 0.35, 0.04), 90);
    },
    cueRebellionTwist: () => {
      playTone(528, 0.4, 0.055);
      setTimeout(() => playTone(396, 0.4, 0.045), 110);
    },
  };
}
